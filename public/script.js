// const form = document.querySelector("form"),
//         nextBtn = form.querySelector(".nextBtn"),
//         backBtn = form.querySelector(".backBtn"),
//         allInput = form.querySelectorAll(".first input");


// nextBtn.addEventListener("click", ()=> {
//     allInput.forEach(input => {
//         if(input.value != ""){
//             form.classList.add('secActive');
//         }else{
//             form.classList.remove('secActive');
//         }
//     })
// })

// backBtn.addEventListener("click", () => form.classList.remove('secActive'));
var image= document.querySelector(".image_folder")
var add= document.querySelector(".add")
add.addEventListener("click",function(){
    let node = document.createElement('input')
    node.type="file";
    node.name="foo";
    image.appendChild(node)
})
var mobile= document.querySelector(".moblie_nu")
var add= document.querySelector(".add")
add.addEventListener("click",function(){
    let node = document.createElement('input')
    node.type="number";
    node.name="mobile_number";
    mobile.appendChild(node)
})
// var outer = document.getElementById("outer");
// var inner= document.getElementById("inner");
// outer.value= inner.value;
// console.log(outer.value)
