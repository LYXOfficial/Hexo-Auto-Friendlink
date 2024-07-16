import requests
import yaml
import time
APIURL="https://links.yaria.top/api"
SOURCEFILE="./source/links/template/template.md"
DESTFILE="./source/links/index.md"
TIMEFILE="./source/updateTime"
groups=requests.get(f"{APIURL}/getGroups").json()["groups"]
res=[]
for i,group in enumerate(groups):
    res.append({})
    res[i]["class_name"]=group["name"]
    res[i]["class_desc"]=group["descr"]
    res[i]["link_list"]=[]
    links=requests.get(f"{APIURL}/getLinks/?group={group['id']}").json()["links"]
    for j,link in enumerate(links):
        res[i]["link_list"].append({})
        res[i]["link_list"][j]["name"]=link["name"]
        res[i]["link_list"][j]["descr"]=link["descr"]
        res[i]["link_list"][j]["link"]=link["link"]
        res[i]["link_list"][j]["avatar"]=link["avatar"]
        res[i]["link_list"][j]["theme_color"]=link["color"]
with open(SOURCEFILE, "r",encoding="utf-8") as f:
    with open(DESTFILE, "w",encoding="utf-8") as f2:
        f2.write(f.read().replace("{*autoflink*}","{% flink %}\n"+yaml.dump(res,allow_unicode=True)+"\n{% endflink %}"))
with open(TIMEFILE, "w",encoding="utf-8") as f:
    f.write(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime()))