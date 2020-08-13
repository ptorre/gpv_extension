# Go Play Video Externally Extension

Browser extension to play embedded html5 videos in an external player.

I prefer to play instructional videos in a separate player rather than in the browser
because I have more control over size and positioning of the video.
It also allows me to use 'Always on top' mode so I can position the video window wherever I want
it while I write code or work through exercises or examples.
With an external palyer I can scale the video from postage stamp size up to full screen without any strange browser UI issues.

I'm currently using this to watch lesson and lecture videos that require a login:
e.g.: Coursera or O’Reilly online learning classes.

Many sites with embedded html5 video, stream that video from a 3rd party host using a url path that includes some sort of authentication tokens.
So, in principle this should work for any embedded video from a 3rd party host not using some other authorization scheme.
You should be able to use this on other sites if you can figure out the correct request urls for the filter configuration.

The important thing is that you have a valid login and can access the videos in the browser. This extension only intercepts the final loading of the video by the html5 video player and sends that request to an external player instead.

Since I use [mpv](https://mpv.io/), I've included a **VERY** rudimentary `mpv` script in case that is useful for someone.

You can run it like this:
`mpv --script=gpv-remote.lua --script-opts=gpv-remote-port=5000`\
**Note: This script requires [LuaSocket](http://w3.impa.br/~diego/software/luasocket/) which needs to be properly installed on your system.**


Developed and tested with chromium browser.
Should work with chrome, but probably will not work unmodified in other browsers.


The 'go-jump-symbolic.symbolic.png' image used as an icon is takend from the
[GNOME Project Adwaita icon theme](https://github.com/GNOME/adwaita-icon-theme)
and is used under the Creative Commons Attribution-Share Alike 3.0 United States License.
The included 'go-jump-symbolic.symbolic.png' image file retains
the Creative Commons Attribution-Share Alike 3.0 United States License.
