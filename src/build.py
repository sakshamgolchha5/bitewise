"""Rebuilds public/index.html from the source parts in this folder.  Usage: python3 src/build.py"""
import os
here=os.path.dirname(os.path.abspath(__file__)); root=os.path.dirname(here)
css=open(os.path.join(here,"style.css")).read()
js="\n".join(open(os.path.join(here,f)).read() for f in ["data.js","core.js","viz.js","ui1.js","ui2a.js","ui2b.js"])
tpl=open(os.path.join(here,"template.html")).read()
open(os.path.join(root,"public","index.html"),"w").write(tpl.replace("/*CSS*/",css).replace("/*JS*/",js))
print("built public/index.html")
