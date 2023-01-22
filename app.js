const express= require("express");
const bodyparser= require("body-parser");
const mongoose = require('mongoose');
const multer  = require('multer')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
var ran= 50;
//const upload = multer({ dest: 'public/uploads/' })
const path = require('path');
const { stringify } = require("querystring");
const { dirname } = require("path");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function (req, file, cb) {
    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,   Date.now() + path.extname(file.originalname))
  }
})
var upload = multer({ storage: storage })
const app= express();
const SITE_ADDRESS = 'yourwebsite.com';

app.use('/media',express.static(path.join(__dirname, 'media')));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(session({
    secret: 'subodh is cool',
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize());
  app.use(passport.session());
mongoose.connect("mongodb+srv://admin:admin@cluster1.o9ppecy.mongodb.net/interogationDB",{useNewUrlParser:true})
 //mongoose.set("useCreateIndex", true);
 mongoose.set('strictQuery', true)

const detailSchema= {
    Category:[],
    more_info:[],
    Police_Station: String,
    Region_No:Number,
   Name: String,
   Email: String,
   fir_no : String,
   Mobile: [],
   gender : String,
   Occupation: String,
   Age: Number,
   Height:Number,
   Weight:Number,
   Health:String,
   present_address:String,
   permanent_Address:String,
   version: String,
   report: String,
   contact_number : Number,
   alternate_number: Number,
   name1: String,
   address: String,
   mobile_Number1 : Number,
   relation: String,
   Occupation1: String,
   name2 :String,
   address2: String,
   Mobile_Number3: Number,
   involvement: String,
   Occupation2 : String,
   area: String,
   supplies: String,
   Vehicles: String,
   Occupation3: String,
   Date: Date,
   Outcome: String,
   Google_ID: String,
   Other: String,
   more:String,
   foo: []
}
const bailSchema ={
  sno:String,
  date:Date,
  accused_name: String,
  mobile_number: String,
  gender: String,
  police_station: String,
  police_station_no : Number,
  region_no: Number,
  age:Number,
  case:String,
  father_name: String,
  category: [],
  address: String,
  verification: String,
  status: String,
  beatid:String,
  more_info:[]
 
  
}
const uniqueSchema = new mongoose.Schema({
    uni: String
})
//--------------------------------------------------------------dcp /acp Schema---------------------------------------------//
const DcpSchema= new mongoose.Schema({
  username:String,
  password:String
})
DcpSchema.plugin(passportLocalMongoose);
//----------------------------------------------------------------SHO schema ------------------------------------------------------------------------//
// const ShoSchema = new mongoose.Schema({
//     username: String,
//     password : String
// })
// ShoSchema.plugin(passportLocalMongoose);
//-----------------------------------------------------------------Beat Schema----------------------------------------------------------------------//
// const beatSchema = new mongoose.Schema({
//     username: String,
//     password: String
// })
// beatSchema.plugin(passportLocalMongoose);
//---------------------------------------------------------------------------------------------------------------------------------------------------//
const childSchema = new mongoose.Schema({
  sno:Number,
  name:String,
  email:String,
  mobile_number:[],
  gender:String,
  present_occupation:String,
  education_qualification:String,
  age:Number,
  health:String,
  addiction:String,
  name_of_provider:String,
  provider_address:String,
  provider_contact:Number,
  present_address:String,
  permanent_address:String,
  criminal_case:String,
  vehicle_details:String,
  interested_occupation:String,
  other_details:String,
  employer_name:String,
  employer_no:Number,
  employer_address:String,
  image:String

})
//--------------------------------------Dcp collection + authentication code -------------------------------------//
const User= new mongoose.model("User",DcpSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --------------------------------------SHO collection + authentication code ------------------------------------//
// const Shouser = new mongoose.model("Shouser",ShoSchema);
// passport.use(Shouser.createStrategy());
// passport.serializeUser(Shouser.serializeUser());
// passport.deserializeUser(Shouser.deserializeUser());

// -------------------------------------beat collection + authentication code ----------------------------------------//
// const Beat = new mongoose.model("Beat",beatSchema);
// passport.use(Beat.createStrategy());
// passport.serializeUser(Beat.serializeUser());
// passport.deserializeUser(Beat.deserializeUser());
//----------------------------------------unique collection---------------------------------------------------------------------------//
const Uni =  mongoose.model("Uni",uniqueSchema);
const List = mongoose.model("List",detailSchema);
const Bail = new mongoose.model("Bail",bailSchema);

const Child = new mongoose.model("Child",childSchema);



//------------------------------------------get url---------------------------------------------------------------------------------------------//
//-------------------------------------------dcp portal----------------------------------------------------------------//
app.get("/",function(req,res){
    res.sendFile(__dirname+"/home.html")
})
function noCache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}
app.get("/dcp/login",function(req,res){
    res.render("login" ,{warning:""})
  })

app.get("/register",function(req,res){
    res.render("register")
})
app.get("/Dash/:user",function(req,res){
    // List.findOne({fir_no:req.params.user},function(err,founditem){
    //   if(err){
    //     console.log(err);
    //   }
    //   else{
    //     res.render("more",{newitem1:founditem})
    //   }
    // })
    if(req.isAuthenticated()){
        List.findOne({fir_no:req.params.user},function(err,founditem){
              if(err){
                console.log(err);
              }
              else{
                res.render("more",{newitem1:founditem})
              }
            })
    }
    else{
        res.redirect("/dcp/login")
    }
  })
  app.get("/bail/child",function(req,res){
    // Child.find({},function(err,founditem){
    //   res.render("child_dash",{newitem:founditem})
    // })
    if(req.isAuthenticated()){
         Child.find({},function(err,founditem){
      res.render("child_dash",{newitem:founditem})
    })
    }
    else{
        res.redirect("/dcp/login")
    }
  })

  app.get("/child/dash/:user",function(req,res){
    // Child.findOne({sno:req.params.user},function(err,founditem){
    //   if(err){
    //     console.log(err);
    //   }
    //   else{
    //     res.render("child_more",{newitem1:founditem})
    //   }
    // })
    if(req.isAuthenticated()){
        Child.findOne({sno:req.params.user},function(err,founditem){
              if(err){
                console.log(err);
              }
              else{
                res.render("child_more",{newitem1:founditem})
              }
            })
   }
   else{
       res.redirect("/dcp/login")
   }

  })

  app.get("/bail/dash",function(req,res){
    // res.render("bail_dash")
    if(req.isAuthenticated()){
        res.render("bail_dash")
   }
   else{
       res.redirect("/dcp/login")
   }
  })
  app.get("/bail/dash/dcp",function(req,res){
    // res.render("dcp_bail_dash")
    if(req.isAuthenticated()){
        res.render("dcp_bail_dash")
   }
   else{
       res.redirect("/dcp/login")
   }
  })

  app.get("/bail/Dash/name/:user/:verification",function(req,res){

    // if(req.params.verification==="Verified"){
    //   Bail.findOne({sno :req.params.user},function(err,founditem){
    //     if(err){
    //       console.log(err)
    //     }
    //     else{
    //       res.render("verified_more",{newitem1:founditem})
    //     }
    //   })
    // }
    //   else{
    //     Bail.findOne({sno :req.params.user},function(err,founditem){
    //       if(err){
    //         console.log(err)
    //       }
    //       else{
    //         res.render("bail_more",{newitem1:founditem})
    //       }
    //     })
    //   }
    if(req.isAuthenticated()){
        
    if(req.params.verification==="Verified"){
      Bail.findOne({sno :req.params.user},function(err,founditem){
        if(err){
          console.log(err)
        }
        else{
          res.render("verified_more",{newitem1:founditem})
        }
      })
    }
      else{
        Bail.findOne({sno :req.params.user},function(err,founditem){
          if(err){
            console.log(err)
          }
          else{
            res.render("bail_more",{newitem1:founditem})
          }
        })
      }
   }
   else{
       res.redirect("/dcp/login")
   }

    })
    app.get("/bail/dash/police_station",function(req,res){
        
        if(req.isAuthenticated()){
            res.render("bail_dash_police_station")
       }
       else{
           res.redirect("/dcp/login")
       }
      })
//----------------------------------------------------SHO portal-----------------------------------------------------------------------//

app.get("/shoregister",function(req,res){
    res.render("shoregister");
})
app.get("/police/station/login",function(req,res){
    res.render("login_police_station" ,{warning:""})
  })

  app.get("/police/station/bail/dash",function(req,res){
        
    if(req.isAuthenticated()){
        res.render("police_station_name")
   }
   else{
       res.redirect("/police/station/login")
   }
  })
  app.get("/police/Dash/:user",function(req,res){
    // List.findOne({fir_no:req.params.user},function(err,founditem){
    //   if(err){
    //     console.log(err);
    //   }
    //   else{
    //     res.render("more",{newitem1:founditem})
    //   }
    // })
    if(req.isAuthenticated()){
        List.findOne({fir_no:req.params.user},function(err,founditem){
              if(err){
                console.log(err);
              }
              else{
                res.render("police_more",{newitem1:founditem})
              }
            })
    }
    else{
        res.redirect("/police/station/login")
    }
  })
  app.get("/sho/bail/Dash/name/:user/:verification",function(req,res){

    // if(req.params.verification==="Verified"){
    //   Bail.findOne({sno :req.params.user},function(err,founditem){
    //     if(err){
    //       console.log(err)
    //     }
    //     else{
    //       res.render("verified_more",{newitem1:founditem})
    //     }
    //   })
    // }
    //   else{
    //     Bail.findOne({sno :req.params.user},function(err,founditem){
    //       if(err){
    //         console.log(err)
    //       }
    //       else{
    //         res.render("bail_more",{newitem1:founditem})
    //       }
    //     })
    //   }
    if(req.isAuthenticated()){
        
    if(req.params.verification==="Verified"){
      Bail.findOne({sno :req.params.user},function(err,founditem){
        if(err){
          console.log(err)
        }
        else{
          res.render("police_verified_more",{newitem1:founditem})
        }
      })
    }
      else{
        Bail.findOne({sno :req.params.user},function(err,founditem){
          if(err){
            console.log(err)
          }
          else{
            res.render("police_dash_more",{newitem1:founditem})
          }
        })
      }
   }
   else{
       res.redirect("/police/station/login")
   }
})
//-------------------------------------------------------------Beat portal-------------------------------------------------------------------//
//----------------------------------------------------------get requests -------------------------------------------------------------------//
app.get("/beat/home",function(req,res){
  // res.sendFile(__dirname+"/beat_home.html");
    res.render("beat_home_login",{warning:""})
})
app.get("/child",function(req,res){
  if(req.isAuthenticated()){
    res.sendFile(__dirname+"/registration.html")
  }
  else{
    res.redirect("/beat/home")
  }
  })
  
app.get("/beat/login",function(req,res){
  if(req.isAuthenticated()){
    res.render("beat_login",{warning:""})
  }
  else{
    res.redirect("/beat/home")
  }
  
})
app.get("/beat/verifiedit/:user",function(req,res){
  if(req.isAuthenticated()){
  res.sendFile(__dirname+"/interrogation1.html")
  }
  else{
    res.redirect("/beat/home")
  }
})
app.get("/more/:user",function(req,res){
  if(req.isAuthenticated()){
    res.writeHead(302, {
      Location: 'http://localhost:5000/login/'+req.params.user
 });
 res.end();
   
  }
  else{
    res.redirect("/beat/home")
  }
})
app.get("/beat/Dash/name/:user",function(req,res){
  
  if(req.isAuthenticated()){
    List.findOne({fir_no:req.params.user},function(err,founditems){
      if(founditems){
        Bail.findOne({sno:req.params.user},function(err,founditem){ 
            res.render("beat_update",{newitem1:founditem})
        })
      }
       else{
        Bail.findOne({sno:req.params.user},function(err,founditem){ 
          res.render("beat_more",{newitem1:founditem})
      })
       } 
    })
 
}
else{
  res.redirect("/beat/home")
}
})
//------------------------------------------------bail get requests ------------------------------------------------------------------------------//
app.get("/bail",function(req,res){
  res.render("bail_login",{warning:" "})
});
//-------------------------------------------------court verification get requests----------------------------------------------------------//
app.get("/interrogation",function(req,res){
  res.render("auth",{warning:""});
});

//--------------------------------------------------------make video------------------------------------------------------------------------------------//


app.get("/video",function(req,res){
  
    res.writeHead(302, {
              Location: 'http://localhost:5000/court'
         });
         res.end();
})
//--------------------------------------------------------------see videos----------------------------------------------------//
app.get("/seevideo",function(req,res){
  if(req.isAuthenticated()){
  res.writeHead(302, {
    Location: 'http://localhost:5000/login'
});
res.end();
  }
  else{
    res.redirect("/dcp/login")
  }
})
//--------------------------------------------------------------------Search portal get requests--------------------------------------------------------//
app.get("/search/login",function(req,res){
  res.render("search_login",{warning:""})
})

app.get("/search",function(req,res){
  if(req.isAuthenticated()){
    List.find({Region_No:1111},function(err,founditem){
      res.render("search",{newitem:founditem})
    })
      
    }
     
    
    else{
      res.redirect("/search/login")
    }
})
app.get("/search/:user",function(req,res){
   // List.findOne({fir_no:req.params.user},function(err,founditem){
    //   if(err){
    //     console.log(err);
    //   }
    //   else{
    //     res.render("more",{newitem1:founditem})
    //   }
    // })
    if(req.isAuthenticated()){
      List.findOne({fir_no:req.params.user},function(err,founditem){
            if(err){
              console.log(err);
            }
            else{
              res.render("search_more",{newitem1:founditem})
            }
          })
  }
  else{
      res.redirect("/search/login")
  }
})
app.get("/search/bail/:user",function(req,res){
  var p =req.params.user;
  if(req.isAuthenticated()){
      
  
    Bail.findOne({sno :req.params.user},function(err,founditem){
      if(!founditem){
        res.render("bail_search",{ user :req.params.user})
      }
      else{
        res.render("search_bail_more",{newitem1:founditem})
      }
    })
  
    
 }
 else{
     res.redirect("/search/login")
 }

  })
  //-----------------------------------------------------------search bail get requests --------------------------------------------------//
  app.get("/bail/search",function(req,res){
    res.render("bail_search_login",{warning:""})
  })
  app.get("/bail/search/dash",function(req,res){
    if(req.isAuthenticated){
      Bail.find({verification:"Unverified"},function(err,founditem){
        if(err){
          console.log(err);
        }
        else{
          res.render("bail_search_dash",{newitem:founditem})
        }
      })
    }
    else{
      res.redirect("/bail/search");
    }
  })
app.get("/bail/search/name/:user",function(req,res){
  if(req.isAuthenticated()){
    Bail.findOne({sno:req.params.user},function(err,founditem){
       res.render("verified_more",{newitem1:founditem})
    })
  }
  else{
   res.redirect("/bail/search")
  }
})

//--------------------------------------------------------------------------------------------------------------------------------------//
// ------------------------------------------post requests ------------------------------------------------------------------------------------//
//------------------------------------------------------------Dcp portal------------------------------------------------------------------------//
app.post("/register",function(req,res){
  User.register({username : req.body.username}, req.body.password, function(err,user){
   if(err){
    console.log(err);
     res.redirect("/register")
   }
   else{
    passport.authenticate("local")(req ,res ,function(){
        res.redirect("/");
    })
   }
  })
})

app.post("/dcp/login",function(req,res){
    // User.findOne({username:req.body.username},function(err,founditem){
    //   if(founditem){
    //     if(founditem.password===req.body.password){
          
    //       List.find({Region_No:req.body.No}, function(err, founditems){
    //           if(err){
    //             console.log(err);
    //           }
    //           else{
    //             res.render("Dash",{newitem:founditems})
    //           }
    //         })
         
    //   }
    // else{
    //   res.render("login",{warning:"wrong password or username"})
    // }
        
    // }
    // else{
    //   res.render("login",{warning:"wrong password or username"})
    // }
      
    // })
    const user= new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user,function(err){
        if(err){
            console.log(err)
        }
        passport.authenticate("local")(req,res,function(){
            Uni.findOne({uni:req.body.uni},function(err,founditem){
                if(err){
                    console.log(err);
                }
                else{
                     if(!founditem){
                        res.send("<h1>You have entered the wrong unique id try again</h1>")
                     }
                     else{
                      if( req.body.password.includes("DCP")===true||req.body.password.includes("ACP")==true){
                        List.find({Region_No:req.body.No}, function(err, founditems){
                            if(err){
                              console.log(err);
                            }
                            else{
                              res.render("Dash",{newitem:founditems})
                            }
                          })
                        }
                        else{
                          res.send("<h1> You are not authorise person </h1>")
                        }
                     }
                }
            })
        })
    })
  })
  app.post("/bail/dash/dcp",function(req,res){
    Bail.find({region_no:req.body.No,verification:req.body.verification},function(err,founditems){
      if(err){
        console.log(err);
      }
      else{
        res.render("dash_bail",{newitem:founditems})
      }
    })
  })
  app.post("/bail/dash/police_station",function(req,res){
    Bail.find({ police_station:req.body.police ,verification:req.body.verification},function(err,founditems){
      if(err){
        console.log(err);
      }
      else{
        res.render("dash_bail",{newitem:founditems})
      }
    })
  })
  app.post("/bail/name/:user",function(req,res){
    Bail.updateMany({sno:req.params.user},{beatid:req.body.beatId},function(err){
      if(err){
        console.log(err);
      }
      else{
        res.render("export");
      }
    })
  })
//------------------------------------------------------------ Sho portal-------------------------------------------------------------------------------//
// app.post("/shoregister",function(req,res){
//     User.register({username : req.body.username}, req.body.password, function(err,user){
//      if(err){
//       console.log(err);
//        res.redirect("/shoregister")
//      }
//      else{
//       passport.authenticate("local")(req ,res ,function(){
//           res.redirect("/");node 
//       })
//      }
//     })
//   })
  app.post("/police/station/login",function(req,res){
    // User.findOne({username:req.body.username},function(err,founditem){
    //   if(founditem){
    //     if(founditem.password===req.body.password){
          
    //       // List.find({Region_No:req.body.No}, function(err, founditems){
    //       //     if(err){
    //       //       console.log(err);
    //       //     }
    //       //     else{
    //       //       res.render("Dash",{newitem:founditems})
    //       //     }
    //       //   })
    //       res.redirect("/police/station/"+req.body.No);
    //   }
    // else{
    //   res.render("login",{warning:"wrong password or username"})
    // }
        
    // }
    // else{
    //   res.render("login",{warning:"wrong password or username"})
    // }
      
    // })
    const user= new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user,function(err){
        if(err){
            console.log(err)
        }
        passport.authenticate("local")(req,res,function(){
          if(req.body.password.includes("DCP")==true||req.body.password.includes("ACP")==true||req.body.password.includes("SHO")==true){
            List.find({ Police_Station:req.body.No}, function(err, founditems){
                if(err){
                  console.log(err);
                }
                else{
                  res.render("police_station_dash",{newitem:founditems})
                }
              })
            }
            else{
              res.send("<h1> You are not authorise person </h1>")
            }
        })
    })
  })
  
  app.post("/bail/dash/sho",function(req,res){
    Bail.find({ police_station:req.body.No ,verification:req.body.verification},function(err,founditems){
      if(err){
        console.log(err);
      }
      else{
        res.render("police_dash_bail",{newitem:founditems})
      }
    })
  })
//---------------------------------------------------------------------Beat portal-----------------------------------------------------------------//
  app.post("/home",function(req,res){
  const user= new User({
    username: req.body.username,
    password: req.body.password
});
req.login(user,function(err){
    if(err){
        console.log(err)
    }
    passport.authenticate("local")(req,res,function(){
      if(req.body.password.includes("DCP")==true||req.body.password.includes("ACP")==true || req.body.password.includes("SHO")==true||req.body.password.includes("beat")==true){
      res.sendFile(__dirname+"/beat_home.html");
      }
      else{
        res.send("<h1> You are not authorise person </h1>")
      }
    })
})
  }) 
  app.post("/Registration",upload.single('image'),function(req,res){
    console.log(req.file);
     ran++;
    const item= new Child({
      sno:ran,
      name:req.body.name,
      email:req.body.email,
      mobile_number:req.body.mobile_number,
      gender:req.body.gender,
      present_occupation:req.body.present_occupation,
      education_qualification:req.body.education_qualification,
      age:Number(req.body.age),
      health:req.body.health,
      addiction:req.body.addiction,
      name_of_provider:req.body.name_of_provider,
      provider_address:req.body.provider_address,
      provider_contact:Number(req.body.provider_contact),
      present_address:req.body.present_address,
      permanent_address:req.body.permanen_address,
      criminal_case:req.body.criminal_case,
      vehicle_details:req.body.vehicle_details,
      interested_occupation:req.body.interested_occupation,
      other_details:req.body.other_details,
      employer_name:req.body.employer_name,
      employer_no:Number(req.body.employer_no),
      employer_address:req.body.employer_address,
      image:req.file.filename
    })
    item.save();
        res.sendFile(__dirname+"/submit.html")
  }) 

  app.post("/beat/login",function(req,res){
    // User.findOne({username:req.body.username},function(err,founditem){
    //   if(founditem){
    //     if(founditem.password===req.body.password){
          
          Bail.find({beatid:req.body.No,verification:req.body.verification}, function(err, founditems){
              if(err){
                console.log(err);
              }
              else{
                res.render("beat_dash",{newitem:founditems})
              }
            })
      // }
    // else{
    //   res.render("beat_login",{warning:"wrong password or username"})
    // }
        
    // }
    // else{
    //   res.render("beat_login",{warning:"wrong password or username"})
    // }
      
    // })
  })
  app.post("/beat/verifiedit", upload.array('foo'),function(req, res) {

    List.findOne({fir_no:req.body.fir_no},function(err,founditem){
      if(!founditem){
        const item1= new List({
          Category:req.body.category,
          Police_Station: req.body.Police_Station,
          Region_No: req.body.Region_No,
          Name: req.body.Name,
          fir_no : req.body.fir_no,
           Email: req.body.Email,
           Mobile: req.body.Mobile,
          gender : req.body.gender,
          more_info : req.body.more_info,
          Occupation: req.body.Occupation,
          Age: Number(req.body.age),
          Height:Number(req.body.height),
          Weight:Number(req.body.weight),
          Health:req.body.health,
          present_address:req.body.present_address,
          permanent_Address:req.body.permanent_Address,
          version: req.body.version,
         report: req.body.report,
         contact_number : Number(req.body.contact_number),
         alternate_number:Number(req.body.alternate_number),
         name1: req.body.name1,
         address: req.body.address,
         mobile_Number1 : Number(req.body.mobile_Number1),
         relation: req.body.relation,
         Occupation1: req.body.Occupation1,
          name2 :req.body.name2,
         address2: req.body.address2,
         Mobile_Number3:Number(req.body.Mobile_Number3),
         involvement: req.body.involvement,
         Occupation2 : req.body.Occupation2,
        area: req.body.area,
        supplies: req.body.supplies,
        Vehicles: req.body.Vehicles,
        Occupation3: req.body.Occupation3,
        Date: req.body.Date1,
        Outcome: req.body.Outcome,
        Google_ID: req.body.Google_ID,
         Other: req.body.Other,
         more:req.body.more,
         foo:req.files,
         more_info:req.body.more_info
        })
        Bail.findOne({sno:req.body.fir_no},function(err,founditem){
          if(founditem){
            founditem.more_info.push(req.body.more_info);
            founditem.save();
          }
        })
        item1.save();
        res.sendFile(__dirname+"/submit_sucess.html")

        
      }
      else{
        console.log("subodh is cool");
        founditem.Police_Station= req.body.Police_Station;

        founditem.save();
        

      }
    })
    Bail.updateMany({sno:req.body.fir_no},{verification:"Verified"},function(err){
      if(err){
        console.log(err);
      }
      else{
        res.sendFile(__dirname+"/submit_sucess.html")
      }
    })
});
// ----------------------------------------------------bail portal post requests --------------------------------------------------------------//
app.post("/bail/login",function(req,res){
  // User.findOne({username:req.body.username},function(err,founditem){
  //   if(founditem){
  //     if(founditem.password===req.body.password){
  //       res.sendFile(__dirname+"/bail.html")
       
  //   }
  // else{
  //   res.render("bail_login",{warning:"wrong password or username"})
  // }
      
  // }
  // else{
  //   res.render("bail_login",{warning:"wrong password or username"})
  // }
    
  // })
  const user= new User({
    username: req.body.username,
    password: req.body.password
});
req.login(user,function(err){
    if(err){
        console.log(err)
    }
    passport.authenticate("local")(req,res,function(){
      res.sendFile(__dirname+"/bail.html");
    })
})
})
app.post("/bail",function(req,res){
  Bail.findOne({sno:req.body.sno},function(err,founditem){
     if(!founditem){
      const item= new Bail({
        sno:req.body.sno,
        date:req.body.date,
        accused_name:req.body.accused_name,
        mobile_number: req.body.mobile_number,
        gender: req.body.gender,
        police_station:req.body.police_station,
        region_no: Number(req.body.region_no),
        age:Number(req.body.age),
        case:req.body.case,
        father_name: req.body.father_name,
        category: req.body.category,
        address: req.body.address,
        verification: req.body.verification,
        status: req.body.status,
        beatid:req.body.beatid,
        more_info:req.body.more_info
      })
      item.save();
      res.sendFile(__dirname+"/submit1.html")
     }
     else{
      founditem.beatid=req.body.beatid
       founditem.date=req.body.date
       founditem.police_station=req.body.police_station;
       founditem.verification=req.body.verification;
       for(var i=0;i<req.body.category.length;i++){
         founditem.category.push(req.body.category[i]);
       }
       founditem.case=req.body.case
       founditem.more_info=req.body.more_info
       founditem.save();
       console.log("save done")
       res.sendFile(__dirname+"/submit1.html")
     }
  })

})
//--------------------------------------------------------post requets------------------------------------------------------------//
app.post("/interrogation/login",function(req,res){
  // User.findOne({username:req.body.username},function(err,founditem){
  //   if(founditem){
  //     if(founditem.password===req.body.password){
  //       res.sendFile(__dirname+"/interrogation.html")
       
  //   }
  // else{
  //   res.render("auth",{warning:"wrong password or username"})
  // }
      
  // }
  // else{
  //   res.render("auth",{warning:"wrong password or username"})
  // }
    
  // })
  const user= new User({
    username: req.body.username,
    password: req.body.password
});
req.login(user,function(err){
    if(err){
        console.log(err)
    }
    passport.authenticate("local")(req,res,function(){
      res.sendFile(__dirname+"/interrogation.html");
    })
})
  
})
app.post("/interrogation",upload.array('foo'), function(req, res,next) {
  List.findOne({fir_no:req.body.fir_no},function(err,founditem){
    if(!founditem){
      const item= new List({
        Category:req.body.category,
        Police_Station: req.body.Police_Station,
        Region_No: req.body.Region_No,
        Name: req.body.Name,
        fir_no : req.body.fir_no,
         Email: req.body.Email,
         Mobile: req.body.Mobile,
        gender : req.body.gender,
        Occupation: req.body.Occupation,
        Age: Number(req.body.age),
        Height:Number(req.body.height),
        Weight:Number(req.body.weight),
        Health:req.body.health,
        present_address:req.body.present_address,
        permanent_Address:req.body.permanent_Address,
        version: req.body.version,
       report: req.body.report,
       contact_number : Number(req.body.contact_number),
       alternate_number:Number(req.body.alternate_number),
       name1: req.body.name1,
       address: req.body.address,
       mobile_Number1 : Number(req.body.mobile_Number1),
       relation: req.body.relation,
       Occupation1: req.body.Occupation1,
        name2 :req.body.name2,
       address2: req.body.address2,
       Mobile_Number3:Number(req.body.Mobile_Number3),
       involvement: req.body.involvement,
       Occupation2 : req.body.Occupation2,
      area: req.body.area,
      supplies: req.body.supplies,
      Vehicles: req.body.Vehicles,
      Occupation3: req.body.Occupation3,
      Date: Date(req.body.Date1),
      Outcome: req.body.Outcome,
      Google_ID: req.body.Google_ID,
       Other: req.body.Other,
       more:req.body.more,
       foo:req.files,
       more_info:req.body.more_info
      })
      item.save();
      res.sendFile(__dirname+"/submit.html")
    }
    else{
      console.log("subodh is cool");
      founditem.Police_Station= req.body.Police_Station;
      founditem.save();
      res.sendFile(__dirname+"/submit.html")

    }
  })
  
});
//----------------------------------------------------post requests of search portal ----------------------------------------------------------//
app.post("/search/login",function(req,res){
  const user= new User({
    username: req.body.username,
    password: req.body.password
})
   
  req.login(user,function(err){
    if(err){
        console.log(err)
    }
    passport.authenticate("local")(req,res,function(){
      res.redirect("/search")
    })
})
})
app.post("/search/update/:user",function(req,res){
  
  
    List.findOne({fir_no:req.params.user},function(err,founditem){
      founditem.Category=req.body.category
      founditem.more_info.push(req.body.more_info);
      founditem.save();
    })
    Bail.findOne({sno:req.params.user},function(err,founditems){
      if(!founditems){
        res.send("<h1>update</h1>")
      }
      else{
       
        founditems.more_info.push(req.body.more_info);
        founditems.save();
      }
    })
    
     res.send("<h1> updated</h1>")
  
})
app.post("/search/update/name/:user",function(req,res){
  List.findOne({fir_no:req.params.user},function(err,founditem){
    founditem.Category=req.body.category
    founditem.more_info.push(req.body.more_info);
    founditem.save();
    res.send("<h1>Updated</h1>")
  })
})
//---------------------------post requests of bail search portal ----------------------------------------------------------------------//
app.post("/bail/search",function(req,res){
   const user = new User({
    username : req.body.username,
    password : req.body.password
   })
   req.login(user,function(err){
    if(err){
        console.log(err)
    }
    passport.authenticate("local")(req,res,function(){
      res.redirect("/bail/search/dash")
    })
})
})


//-----------------------------------------------------------------------------------------------------------------------------------------------------//
app.listen(8080,function(req,res){
    console.log("server started")
})
