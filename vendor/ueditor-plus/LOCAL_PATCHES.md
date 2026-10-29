# Local integration patch

Upstream: modstart-lib/ueditor-plus v4.5.0, Apache-2.0.
The official dist-min.zip SHA-256 is recorded in ../manifest.json.

`ueditor.all.js` iframe initialization is patched by shell/vendor/patch-ueditor.py:
create an about:blank iframe, write its document from the trusted external script,
and invoke the existing editor setup directly. No javascript: iframe URL or inline
bootstrap script is needed. Other upstream editor code is unchanged.

The first-party adapter in public/admin/js/article/editor.js attaches upstream UI
event handlers as DOM listeners only inside trusted UEditor UI containers. Stored
article HTML is never used as an event source. The existing administrator CSP is
preserved; unsafe-inline scripts are not enabled.
