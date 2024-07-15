document.onkeypress=(event)=>{
    if(event.keyCode==13)
        document.getElementById("login").click();
};
document.getElementById("login").onclick=()=>{
    var pwd=document.getElementById("pwd").value;
    if(pwd==""){
        Snackbar.show({
            text:"密码不能为空",
            showAction: false,
            pos: "top-center"
        });
    }
    else{
        Snackbar.show({
            text:"登录中...",
            showAction: false,
            pos: "top-center"
        });
        async function sha256(message){
            const msgBuffer=new TextEncoder().encode(message);
            const hashBuffer=await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray=Array.from(new Uint8Array(hashBuffer));
            const hashHex=hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        }
        (async ()=>{
            var pwdsha=await sha256(pwd);
            var xhr=new XMLHttpRequest();
            xhr.open("POST", `/api/login`);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange=()=>{
                if(xhr.readyState==4&&xhr.status==200){
                    document.cookie=`token=${JSON.parse(xhr.responseText)["token"]};path=/;max-age=1145141919`;
                    Snackbar.show({
                        text:"登录成功，跳转中...",
                        showAction: false,
                        pos: "top-center"
                    });
                    setTimeout(()=>{
                        location.href="/manager.html";
                    },500);
                }
                else if(xhr.readyState==4&&xhr.status==403){
                    Snackbar.show({
                        text:"登录失败，密码错误",
                        showAction: false,
                        pos: "top-center"
                    })
                }
                else if(xhr.readyState==4){
                    Snackbar.show({
                        text:"登录失败，请检查",
                        showAction: false,
                        pos: "top-center"
                    });
                }
            }
            xhr.send(JSON.stringify(
                {pwd:pwdsha}
            ));
        })();
    }
};
if(document.cookie.indexOf("token=")!=-1){
    document.location="/manager.html";
}