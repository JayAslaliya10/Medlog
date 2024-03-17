const express=require("express");
const app=express();
const bodyparser=require("body-parser");
const ejs=require("ejs");
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("static"));
const mongoose = require('mongoose');
const images = [{image:"https://www.freepik.com/free-vector/clean-medical-background_13313271.htm#page=1&query=medical%20background&position=1&from_view=keyword"}]

app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/Medlog").then(()=>console.log('connection succssful')).catch((er)=>console.log(er))

const userSchema = {
    username:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    name:{type:String, required:true},
    phone:{type:Number, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    gender:{type:String, required:true},
    dob:{type:String, required:true},
    bloodgroup:{type:String, required:true},
    weight:{type:Number, required:true},
    height:{type:Number, required:true},
    allergies:String,
    medcon:String
}

const docSchema = {
    username:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    name:{type:String, required:true},
    phone:{type:Number, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    clname:{type:String, required:true},
    cladd:{type:String, required:true},
    speciality:{type:String, required:true}
}

const linkreqSchema = {
    patphone:Number,
    name:String,
    username:String,
    patname:String,
    spec:String,
    clname:String,
    docnum:Number,
    cladd:String
}

const linkSchema = {
    patname:String,
    patgen:String,
    patbloodgroup:String,
    patdob:String,
    patusername:String,
    patphone:Number,
    patemail:String,
    patweight:Number,
    patheight:Number,
    patal:String,
    patmedcon:String,
    docname:String,
    docusername:String,
    docspec:String,
    clname:String,
    cladd:String,
    docphone:Number
}

const conSchema = {
    name:{type:String, required:true},
    treatment:{type:String, required:true},
    date:{type:String, required:true},
    time:{type:String, required:true},
    medication:{type:String, required:true},
    cost:{type:Number, required:true},
    prescription:{type:String, required:true},
    instruction:{type:String, required:true},
    docname:String,
    docusername:String,
    clin:String,
    spec:String
}


const User = mongoose.model("User",userSchema)
const Doc = mongoose.model("Doc",docSchema)
const Link = mongoose.model("Link",linkSchema)
const Linkreq = mongoose.model("Linkreq",linkreqSchema)
const Con = mongoose.model("Con",conSchema)

let nme=""
let patnum =""
let docunme =""
let docnme=""
let patname=""

app.get('/',(req, res) => {
    res.render('index',{images:images})
})

app.get('/pat-login', (req,res)=>{
    res.render('patlogin')
})

app.get('/pat-signup',(req, res) => {
    res.render('patsignup1')
})

app.get('/pat-signup2', (req, res) => {
    res.render('patsignup2')
})

app.get('/pat-dashboard',async (req, res) => {
    Linkreq.find({patphone:patnum}, async function (er,cd){
            if(!er){
                const a = await User.findOne({phone:patnum})
                res.render('patdashboard',{
                    patname:nme,
                    name:cd,
                    phone:a.phone,
                    email:a.email,
                    gen:a.gender,
                    dob:a.dob,
                    bg:a.bloodgroup,
                    h:a.height,
                    w:a.weight,
                    al:a.allergies,
                    m:a.medcon
                })
        }
    }) 
})

app.get('/doc-login', (req,res)=>{
    res.render('doclogin')
})

app.get('/doc-signup', (req,res)=>{
    res.render('docsignup')
})

let x=""
let y=""
let pc=0
let cc=0

app.get('/doc-dashboard',async (req, res) => {
    const g1 = await Link.find({docusername:docunme})
    const g2 = await Linkreq.find({username:docunme})

    const ch = await Doc.findOne({username:docunme})

    Link.find({docusername:docunme}, function(er,dat){
        if(er){
            console.log(er)
        }
        else{
                pc++
        }
    })
    Con.find({docusername:docunme}, function(er,dat){
        if(er){
            console.log(er)
        }
        else{
          cc++
        }
    })
    res.render('docdashboard',{
        pats:g1,
        name:docnme,
        pat:g2,
        phone:ch.phone,
        email:ch.email,
        clinic:ch.clname,
        add:ch.cladd,
        patcount:pc,
        speciality:docspec,
        conscount:cc,
        clname:docclname
    })
})


app.post("/patlogin", async (req,res)=>{
    const unme = req.body.uname
    const passw = req.body.pass

    // console.log(User);
    // console.log(unme)
    // console.log(passw)
    // console.log(checkuser)
    
    const checkuser = await User.findOne({username:unme}).lean()

    if(!checkuser){
        console.log("Invalid username/password")
    }

    if(passw === checkuser.password){
        nme=checkuser.name
        patnum=checkuser.phone
        res.redirect("/pat-dashboard")
    }
    else{
        console.log("Invalid username/password")
    }
})

let username=""
let password=""
let fname=""
let phone=""
let email=""

app.post("/patsignup1",(req,res)=>{
    username = req.body.uname
    password = req.body.pass
    fname = req.body.fname
    phone = req.body.number
    email = req.body.email

    nme = req.body.fname
    patnum = req.body.number
    res.redirect("/pat-signup2")
})

app.post("/patsignup2",(req,res)=>{
    var user = new User ({
            username:username,
            password:password,
            name:fname,
            phone:phone,
            email:email,
            weight:req.body.weight,
            height:req.body.height,
            gender:req.body.gender, 
            dob:req.body.dob,
            bloodgroup:req.body.bg,
            allergies:req.body.al,
            medcon:req.body.medcon
    })
    user.save((er)=>{
        if(!er){
            res.redirect("/pat-dashboard")
        }
    })
    
})


let docspec=""
let docclname=""
let docnum=""
let cla=""

app.post("/doclogin", async (req,res)=>{
    const username = req.body.uname
    const password = req.body.pass
    const checkdoc = await Doc.findOne({username}).lean()
    if(!checkdoc){
        console.log("Invalid username/password")
    }

    if(password === checkdoc.password){
        docnme=checkdoc.name
        docunme=checkdoc.username
        docspec=checkdoc.speciality
        docclname=checkdoc.clname
        docnum=checkdoc.phone
        cla=checkdoc.cladd
        res.redirect("/doc-dashboard")
    }
    else{
        console.log("Invalid username/password")
    }
})

app.post("/docsignup",async (req,res)=>{

    var doc = new Doc ({
        username:req.body.uname,
        password:req.body.pass,
        name:req.body.fname,
        phone:req.body.number,
        email:req.body.email,
        clname:req.body.clname,
        cladd:req.body.cladd,
        speciality:req.body.speciality
    })
    // console.log(doc)
    doc.save((er)=>{
        if(er){
            console.log(er)
        }
        else{
            res.redirect("/doc-dashboard")
        }
    })
    docnme = req.body.fname
    docunme = req.body.uname
    docspec=req.body.speciality
    docclname=req.body.clname
    docnum=req.body.number
    cla=req.body.cladd
})

let d = ""
app.post("/newpatient", async (req,res) => {
    const ph = req.body.ph
    const s = await User.findOne({phone:ph}).lean()
    console.log(s.name)

    var linkreq = new Linkreq ({
        patphone:req.body.ph,
        patname:s.name,
        username:docunme,
        name:docnme,
        spec:docspec,
        clname:docclname,
        docnum:docnum,
        cladd:cla
    })
    linkreq.save((er)=>{
        if(!er){
            res.redirect("/reg")
        }
    })
})

let na="" 
let spe=""
let cln=""
let clad=""
let docp=""

app.post("/accept", async (req,res) => {
    username=req.body.docusname
    const xyz = await Doc.findOne({username}).lean()
    na = xyz.name
    console.log(na)
    User.find({phone:patnum}, function(er,cd){
        if(er){
            console.log("err is:",er);
        }else{
            console.log(na)
            cd.forEach(element => {
                var link = new Link ({
                    patname:element.name,
                    patusername:element.username,
                    patgen:element.gender,
                    patbloodgroup:element.bloodgroup,
                    patdob:element.dob,
                    patphone:element.phone,
                    patemail:element.email,
                    patweight:element.weight,
                    patheight:element.height,
                    patal:element.allergies,
                    patmedcon:element.medcon,
                    docname:na,
                    docusername:req.body.docusname,
                    docspec:xyz.speciality,
                    clname:xyz.clname,
                    cladd:xyz.cladd,
                    docphone:req.body.docphone
                })
                link.save()
            })
        }
    })
    Linkreq.findOneAndDelete({patphone:patnum, username:req.body.docusname},function (er,cd){
        if(er){
            console.log("err is:",er);
        }else{
            res.redirect("/pat-dashboard")
        }
    })
})

app.post("/decline", (req,res) => {
    console.log(req.body.docname)
    Linkreq.findOneAndDelete({patphone:patnum, username:req.body.docusname},function (er,cd){
        if(er){
            console.log("err is:",er);
        }else{
            res.redirect("/pat-dashboard")
        }
    })
})

app.get("/reg", async (req,res)=>{
    const v1 = await Link.find({docusername:docunme})
    const v2 = await Linkreq.find({username:docunme})
    res.render("regpatient",{
        name:v1,
        lname:v2
    })
})

app.get('/doc-cons', async (req,res)=>{
    const h1 = await Con.find({docusername:docunme})
    const h2 = await Link.find({docusername:docunme})
    const v = await Doc.findOne({username:docunme})
    res.render("doccons",{
        pats:h2,
        name:h1,
        clinic:v.clname
    })
})



app.post("/newcons", (req,res)=>{
    var con = new Con({
        name:req.body.patient,
        treatment:req.body.treatment,
        date:req.body.date,
        time:req.body.time,
        medication:req.body.med,
        cost:req.body.cost,
        prescription:req.body.prescription,
        instruction:req.body.instructions,
        docname:docnme,
        spec:docspec,
        clin:docclname,
        docusername:docunme
    })
    con.save()
    res.redirect('/doc-cons')
})

let c =""
app.get("/cons", async (req,res) => {
    c= await Con.find({name:nme})
    res.render('patcons',{
        n:c
    })
})

let z=""
app.get('/pat-docs', async (req,res) => {
    z= await Link.find({patname:nme})
    res.render('patdocs',{
        n:z
    })
})

app.get('/med', async (req,res) => {
    c= await Con.find({name:nme})
    res.render('pat-med',{
        n:c
    })
})

app.get('/pre', async (req,res) => {
    c= await Con.find({name:nme})
    res.render('pat-pre',{
        n:c
    })
})

app.get('/docpre', async(req,res) => {
    c= await Con.find({docusername:docunme})
    res.render('doc-pre',{
        n:c
    })
})
app.get('/docmed', async(req,res) => {
    c= await Con.find({docusername:docunme})
    res.render('doc-med',{
        n:c
    })
})

app.listen(80,()=>{
    console.log("started");
})

