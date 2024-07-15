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
DEBUG=False
EMAIL_TEMPLATE="""<html><head></head><body><div><includetail><div style="font:Verdana normal 14px;color:#000;"><div style="position:relative;"><div class="eml-w eml-w-sys-layout"><a style="margin: 15px 50px;font-weight:bold;font-size:20px;display: flex;color: black;"href="https://blog.yaria.top">Ariasakaの小窝</a><div style="font-size: 0px;"><div class="eml-w-sys-line"><div class="eml-w-sys-line-left"></div><div class="eml-w-sys-line-right"></div></div></div><div class="eml-w-sys-content"><div class="dragArea gen-group-list"><div class="gen-item"draggable="false"><div class="eml-w-item-block"style="padding: 0px 0px 0px 1px;"><div class="eml-w-title-level3">{}</div><div><div class="eml-w-phase-small-normal"><p class="spp">name:{}<br/>link:<a href="{}">{}</a><br/>avatar:<a href="{}">{}</a><br/>descr:{}<br/>email:<a href="mailto:{}">{}</a><br/>color:{}<br/></p><p><a href="{}">{}</a></p></div></div></div></div></div></div><div class="eml-w-sys-footer">Ariasakaの小窝</div></div></div></div><!--<![endif]--></includetail></div><style>.eml-w.eml-w-phase-normal-16{color:#2b2b2b;font-size:16px;line-height:1.75}.eml-w.eml-w-phase-bold-16{font-size:16px;color:#2b2b2b;font-weight:500;line-height:1.75}.eml-w-title-level1{font-size:20px;font-weight:500;padding:15px 0}.eml-w-title-level3{font-size:16px;font-weight:500;padding-bottom:10px}.eml-w-title-level3.center{text-align:center}.eml-w-phase-small-normal{font-size:14px;color:#2b2b2b;line-height:1.75}.eml-w-picture-wrap{padding:10px 0;width:100%;overflow:hidden}.eml-w-picture-full-img{display:block;width:auto;max-width:100%;margin:0 auto}.eml-w-sys-layout{background:#fff;box-shadow:0 2px 8px 0 rgba(0,0,0,.2);border-radius:4px;margin:50px auto;max-width:700px;overflow:hidden}.eml-w-sys-line-left{display:inline-block;width:88%;background:#2984ef;height:3px}.eml-w-sys-line-right{display:inline-block;width:11.5%;height:3px;background:#8bd5ff;margin-left:1px}.eml-w-sys-logo{text-align:right}.eml-w-sys-logo img{display:inline-block;margin:30px 50px 0 0}.eml-w-sys-content{position:relative;padding:20px 50px 0;min-height:216px;word-break:break-all}.eml-w-sys-footer{font-weight:500;font-size:12px;color:#bebebe;letter-spacing:.5px;padding:0 0 30px 50px;margin-top:60px}.eml-w{font-family:Helvetica Neue,Arial,PingFang SC,Hiragino Sans GB,STHeiti,Microsoft YaHei,sans-serif;-webkit-font-smoothing:antialiased;color:#2b2b2b;font-size:14px;line-height:1.75}.eml-w a{text-decoration:none}.eml-w a,.eml-w a:active{color:#186fd5}.eml-w h1,.eml-w h2,.eml-w h3,.eml-w h4,.eml-w h5,.eml-w h6,.eml-w li,.eml-w p,.eml-w ul{margin:0;padding:0}.eml-w-item-block{margin-bottom:10px}@media(max-width:420px){.eml-w-sys-layout{border-radius:none!important;box-shadow:none!important;margin:0!important}.eml-w-sys-layout.eml-w-sys-line{display:none}.eml-w-sys-layout.eml-w-sys-logo img{margin-right:30px!important}.eml-w-sys-layout.eml-w-sys-content{padding:0 35px!important}.eml-w-sys-layout.eml-w-sys-footer{padding-left:30px!important}}.spp{padding:20px!important;margin:20px!important;background-color:#e7e7e7;font-family:monospace;border:1px solid lightgray}</style></body></html>"""
from typing import Union
from fastapi import FastAPI,Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from email.mime.text import MIMEText
from email.header import Header
import requests,time,random,os,smtplib
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
    email:str=None
class Group(BaseModel):
    name:str=None
    pos:int=None
    token:str=None
    descr:str=None
    oid:str=None
class SendRequest(BaseModel):
    token:str=None
    groupname:str=None
    email:str=None
    name:str=None
class EditRequest(BaseModel):
    oid:str=None
    name:str=None
    link:str=None
    avatar:str=None
    descr:str=None
    color:str=None
    email:str=None
app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
if DEBUG: 
    with open("debugData.conf") as f:
        datt=f.readlines()
        APPID=datt[0].strip()
        APPKEY=datt[1].strip()
        APPURL=datt[2].strip()
        GHTOKEN=datt[3].strip()
        GHREPO=datt[4].strip()
        SENDEMAIL=datt[5].strip()
        MAILPASS=datt[6].strip()
        SMTPHOST=datt[7].strip()
        SMTPPORT=datt[8].strip()
        OWNEREMAIL=datt[9].strip()
else:
    APPID=os.environ.get("APPID")
    APPKEY=os.environ.get("APPKEY")
    APPURL=os.environ.get("APPURL")
    GHTOKEN=os.environ.get("GHTOKEN")
    GHREPO=os.environ.get("GHREPO")
    SENDEMAIL=os.environ.get("SENDEMAIL")
    MAILPASS=os.environ.get("MAILPASS")
    SMTPHOST=os.environ.get("SMTPHOST")
    SMTPPORT=os.environ.get("SMTPPORT")
    OWNEREMAIL=os.environ.get("OWNEREMAIL")
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
class SMTPClient:
    def __init__(self,host,port,mail,passwd):
        self.host=host
        self.port=port
        self.mail=mail
        self.passwd=passwd
    def send(self,sendname,mailto,subject,content):
        msg=MIMEText(content,'html','utf-8')
        msg['From']=Header(sendname,'utf-8')
        msg['To']=mailto
        msg['Subject']=Header(subject,'utf-8')
        s=smtplib.SMTP_SSL(self.host,self.port)
        s.login(self.mail,self.passwd)
        s.sendmail(self.mail,mailto,msg.as_string())
emsender=SMTPClient(SMTPHOST,SMTPPORT,SENDEMAIL,MAILPASS)
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
def rebuildaction(token:str,response:Response):
    if access(token):
        requests.post(f"https://api.github.com/repos/{GHREPO}/dispatches",
                      headers={
                          "Accept": "application/vnd.github+json",
                          "Authorization": f"token {GHTOKEN}"
                      },
                      json={
                          "event_type": "hooklink"
                      })
        return {"message":"ok"}
    else:
        response.status_code=403
        return {"message":"invaild token"}
@app.post("/api/requestLink")
def requestlink(flink:Flink,response:Response):
    if "<script" in flink.name.lower() or "javascript:" in flink.name.lower()\
        or "<script" in flink.avatar.lower() or "javascript:" in flink.avatar.lower()\
        or "<script" in flink.link.lower() or "javascript:" in flink.link.lower()\
        or "<script" in flink.descr.lower() or "javascript:" in flink.descr.lower()\
        or "<script" in flink.color.lower() or "javascript:" in flink.color.lower():
            response.status_code=403
            return {"message":"XSS attack?"}
    else:
        oid=lca.createObject("pending",{
            "name":flink.name,
            "link":flink.link,
            "avatar":flink.avatar,
            "descr":flink.descr,
            "color":flink.color,
            "email":flink.email,
            "type":0
        })["objectId"]
        try:
            emsender.send("Ariaの友链审核系统",OWNEREMAIL,"Ariasakaの小窝有新的友链申请",
                      EMAIL_TEMPLATE.format("你好，Ariasakaの小窝有新的友链申请：",
                                            flink.name,flink.link,
                                            flink.link,flink.avatar,
                                            flink.avatar,flink.descr,
                                            flink.email,flink.email,
                                            flink.color,"https://links.yaria.top/manager.html",
                                            "点击进入审核"))
            emsender.send("Ariaの友链审核系统",flink.email,"Ariasakaの小窝友链申请成功",
                    EMAIL_TEMPLATE.format("你好，你的友链申请已经成功，请确认并等待审核<br/>如果需要修改友链请在下方链接出修改哦！",
                                        flink.name,flink.link,
                                        flink.link,flink.avatar,
                                        flink.avatar,flink.descr,
                                        flink.email,flink.email,
                                        flink.color,f"https://links.yaria.top/editPending.html?token={oid}",
                                        "点击进入修改页"))
        except:
            return {"message":"send email failed"}
        return {"message":"ok"}
@app.post("/api/changePendingLink")
def changependinglink(er:EditRequest,response:Response):
    if lca.getObjectInfo("pending",er.oid)!={}:
        lca.updateObject("pending",er.oid,{
            "name":er.name,
            "link":er.link,
            "avatar":er.avatar,
            "descr":er.descr,
            "color":er.color,
            "email":er.email,
        });
        return {"message":"ok"}
    else:
        response.status_code=403
        return {"message":"invaild token"}
@app.get("/api/getPendingLinks")
def getpendinglinks(token:str,response:Response):
    if access(token):
        return {"message":"ok","pending":lca.getClassObjects("pending")["results"]}
    else:
        response.status_code=403
        return {"message":"invaild token"}
@app.post("/api/sendPassMail")
def sendpassmail(req:SendRequest,response:Response):
    if access(req.token):
        emsender.send("Ariaの友链审核系统",req.email,"Ariasakaの小窝友链审核通过",
            f"""恭喜你的友链{req.name}通过审核！<br/>已将你的友链放入 {req.groupname} 分组中哦！<br/>在<a href="https://blog.yaria.top/links/">https://blog.yaria.top/links/</a>中查看与申请修改！"""
        )
        return {"message":"ok"}
    else:
        response.status_code=403
        return {"message":"invaild token"}
@app.get("/api/removePendingLink")
def removependinglink(oid:str,response:Response):
    lca.deleteObject("pending",oid)
    return {"message":"ok"}
if __name__=='__main__':
    import uvicorn
    uvicorn.run(app="main:app",host="127.0.0.1",port=8080,reload=1)