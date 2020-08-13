require('mp.options')
require('mp.utils')
require('mp.msg')

local socket = require('socket')
local url = require('socket.url')

local options = {
  port = 5000,
  address = '127.0.0.1',
}

-- override via: --script-opts=gpv-remote-port=5001
--               --script-opts=gpv-remote-address=0.0.0.0
read_options(options, 'gpv-remote')

local function parse_request(connection)

  local line = connection:receive()
  if line == nil or line == '' then
    return
  end
  mp.msg.info(line)

  local request = {}
  local raw_request = string.gmatch(line, '%S+')
  request.request = line
  request.method = raw_request()
  request.path = string.sub(raw_request(), 2)

  while line ~= nil and line ~= '' do
    line = connection:receive()
    mp.msg.info(line)
  end

  return request
end


local function serve(tcp_socket)
  local connection = tcp_socket:accept()
  if connection == nil then
    return
  end

  local request = parse_request(connection)
  if request == nil then
    return
  end

  if request.method == 'GET' then
    -- Blindly load the requested path unless it is already playing
    local current = mp.get_property_native('path', '')
    if( current == request.path) then
      mp.msg.info('Already playing '..request.path)
    else
      mp.msg.info('Loadfile: '..request.path)
      mp.commandv('loadfile', request.path)
    end
    connection:send('HTTP/1.1 202 Accepted\n')
  else
    mp.msg.info('Unsupported HTTP Method: '..request.method)
    connection:send('HTTP/1.1 400 Bad Request\n')
  end

  connection:close()
  return

end

-- Start crude http server
local tcp_socket = socket.bind(options.address, options.port)
if tcp_socket == nil then
  mp.msg.error('Error: could not start server on ' .. options.address .. ':' .. options.port)
else
  -- Don't wait on connections. Poll periodically using a timer.
  tcp_socket:settimeout(0)
  mp.add_periodic_timer(0.1, function() serve(tcp_socket) end)
  mp.msg.info('\nServing on ' .. options.address .. ':' .. options.port .. '\n')
end
