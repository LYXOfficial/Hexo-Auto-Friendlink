"""
Hexo-Auto-FriendLink v0.1.0 Backend By Ariasaka
**Vercel部署+Leancloud数据库
**快来欺负这个蒟蒻太菜了
**FastAPI框架实现
**仅三个依赖
**小笨蛋不会用JWT用Token ww
**小笨蛋不会用数据库用Leancloud
**Leancloud Python文档太抽象了结果手写RESTAPI QAQ
**又是奇怪的码风
"""
from typing import Union
from fastapi import FastAPI,Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests,time,random,os
class Password(BaseModel):
    pwd:str=None
class Flink(BaseModel):
    name:str=None
    link:str=None
    avatar:str=None
    descr:str=None
    color:str=None
    group:int=None
    oid:str=None
    token:str=None
class Group(BaseModel):
    name:str=None
    pos:int=None
    token:str=None
    descr:str=None
    oid:str=None
app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
APPID=os.environ.get("APPID")
APPKEY=os.environ.get("APPKEY")
APPURL=os.environ.get("APPURL")
GHTOKEN=os.environ.get("GHTOKEN")
GHREPO=os.environ.get("GHREPO")
class LeancloudAPI:
    def __init__(self,AppUrl,AppId,AppKey):
        self.AppUrl=AppUrl
        self.AppKey=AppKey
        self.AppId=AppId
    def getClassObjects(self,className:str):
        return requests.get(f"{self.AppUrl}/1.1/classes/{className}?limit=1000",headers={
            "X-LC-Id":self.AppId,
            "X-LC-Key":self.AppKey,
        }).json()
    def getObjectInfo(self,className:str,objectId:str):
        return requests.get(f"{self.AppUrl}/1.1/classes/{className}/{objectId}",headers={
            "X-LC-Id":self.AppId,
            "X-LC-Key":self.AppKey,
        }).json()
    def updateObject(self,className:str,objectId:str,data:dict):
        return requests.put(f"{self.AppUrl}/1.1/classes/{className}/{objectId}",headers={
            "X-LC-Id":self.AppId,
            "X-LC-Key":self.AppKey,
        },json=data).json()
    def createObject(self,className:str,data:dict):
        return requests.post(f"{self.AppUrl}/1.1/classes/{className}",headers={
            "X-LC-Id":self.AppId,
            "X-LC-Key":self.AppKey,
        },json=data).json()
    def deleteObject(self,className:str,objectId:str):
        return requests.delete(f"{self.AppUrl}/1.1/classes/{className}/{objectId}",headers={
            "X-LC-Id":self.AppId,
            "X-LC-Key":self.AppKey,
        }).json()
lca=LeancloudAPI(APPURL,APPID,APPKEY)
def tokengen(lenn=32):
    random_str =''
    base_str='ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz0123456789'
    length=len(base_str)-1
    for i in range(lenn):
        random_str+=base_str[random.randint(0,length)]
    return random_str
def access(token:str):
    lr=lca.getClassObjects("login")["results"][0]["allowtoken"]
    for i in lr:
        if token==i["token"] and i["expires"]>=int(time.time()):
            return True
    return False
@app.post('/api/login')
def login(item:Password,response:Response):
    pwd=item.pwd
    gt=lca.getClassObjects("login")["results"][0]
    if pwd==gt["pwdsha"]:
        oid=gt["objectId"]
        lr=gt["allowtoken"]
        tok=tokengen()
        lr.append({"token":tok,"expires":int(time.time())+2592000})
        lca.updateObject("login",oid,{"allowtoken":lr})
        response.status_code=200
        return {"message":"ok","token":tok}
    else:
        response.status_code=403
        return {"message":"failed"}
@app.get("/api/verifyToken")
def verftoken(token:str,response:Response):
    gt=lca.getClassObjects("login")["results"][0]
    oid=gt["objectId"]
    lr=gt["allowtoken"]
    flag=0
    for i in lr:
        if token==i["token"] and i["expires"]>=int(time.time()):
            flag=1
    ofs=0
    for i in range(len(lr)):
        if lr[i-ofs]["expires"]<time.time():
            lr.pop(i-ofs)
            ofs+=1
    lca.updateObject("login",oid,{"allowtoken":lr})
    if flag==0:
        response.status_code=403
        return "failed"
    else:
        return "ok"
@app.get("/api/getGroups")
def getgroups(response:Response):
    gps=lca.getClassObjects("group")
    gps["results"].sort(key=lambda x:x["pos"])
    rst=[]
    for i in gps["results"]:
        rst.append({"name":i["name"],"id":i["id"],"descr":i["descr"],"pos":i["pos"],"oid":i["objectId"]})
    return {"message":"ok","groups":rst}
@app.get("/api/getLinks")
def getlinks(group:int,response:Response):
    lks=lca.getClassObjects("flink")
    rst=[]
    for i in lks["results"]:
        if i["group"]==group:
            rst.append({"name":i["name"],"link":i["link"],"avatar":i["avatar"],"descr":i["descr"],"color":i["color"],"oid":i["objectId"]})
    return {"message":"ok","links":rst}
@app.post("/api/addGroup")
def addgroup(grp:Group,response:Response):
    if access(grp.token):
        ids=[i["id"] for i in lca.getClassObjects("group")['results']]
        while 1:
            id=random.randint(0,99999999)
            if id not in ids:
                break
        lco={"message":"ok","groupinfo":lca.createObject("group",{"name":grp.name,"descr":grp.descr,"pos":grp.pos,"id":id})}
        lco["groupinfo"]["id"]=id
        return lco
    else:
        response.status_code=403
        return {"message":"invaild token"}
@app.post("/api/modifyGroup")
def modifygroup(grp:Group,response:Response):
    if access(grp.token):
        lca.updateObject("group",grp.oid,{"name":grp.name,"descr":grp.descr,"pos":grp.pos})
        return {"message":"ok"}
    else:
        response.status_code=403
        return {"message":"invaild token"}
@app.get("/api/removeGroup")
def removegroup(token:str,oid:str,response:Response):
    if access(token):
        gid=lca.getObjectInfo("group",oid)["id"]
        lks=lca.getClassObjects("flink")["results"]
        for i in lks:
            if i["group"]==gid:
                lca.deleteObject("flink",i["objectId"])
        lca.deleteObject("group",oid)
        return {"message":"ok"}
    else:
        response.status_code=403
        return {"message":"invaild token"}
@app.get("/api/removeLink")
def removelink(token:str,oid:str,response:Response):
    if access(token):
        lca.deleteObject("flink",oid)
        return {"message":"ok"}
    else:
        response.status_code=403
        return {"message":"invaild token"}
@app.post("/api/addLink")
def addlink(flink:Flink,response:Response):
    if access(flink.token):
        lca.createObject("flink",{"group":flink.group,"name":flink.name,"link":flink.link,"avatar":flink.avatar,"descr":flink.descr,"color":flink.color})
        return {"message":"ok"}
    else:
        pass
@app.post("/api/modifyLink")
def modifylink(flink:Flink,response:Response):
    if access(flink.token):
        lca.updateObject("flink",flink.oid,{"group":flink.group,"name":flink.name,"link":flink.link,"avatar":flink.avatar,"descr":flink.descr,"color":flink.color})
        return {"message":"ok"}
    else:
        response.status_code=403
        return {"message":"invaild token"}
@app.get("/api/destroyToken")
def destroytoken(token:str,response:Response):
    if access(token):
        upd=lca.getClassObjects("login")["results"][0]["allowtoken"]
        for i in upd:
            if i["token"]==token:
                i["expires"]=0
                break
        lca.updateObject("login",lca.getClassObjects("login")["results"][0]["objectId"],{"allowtoken":upd})
        return {"message":"ok"}
    else:
        response.status_code=403
        return {"message":"invaild token"}
@app.get("/api/rebuildAction")
def rebuildAction(token:str,response:Response):
    if access(token):
        requests.post(f"https://api.github.com/repos/{GHREPO}/dispathes",
                      headers={
                          "Accept": "application/vnd.github.everest-preview+json",
                          "Authorization": f"token {GHTOKEN}"
                      },
                      data={
                          "event_type": "hooklink"
                      })
        return {"message":"ok"}
    else:
        response.status_code=403
        return {"message":"invaild token"}
if __name__=='__main__':
    import uvicorn
    uvicorn.run(app="main:app",host="127.0.0.1",port=8080,reload=1)