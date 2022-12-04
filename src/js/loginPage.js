
const button = document.querySelector("#clickbutton")

const email= document.querySelector('#email')
const password= document.querySelector('#password')

console.log(button)

button.addEventListener('click',(e)=>{
console.log("fsdfdshfks")
e.preventDefault();


console.log(email.value)
console.log(password.value)
 if( email.value==="aryankatiyar123" && password.value==="13547978a987bd9a74a72887ecb1d66e7b27dfa345b312f9252b59d653cba56a")
 {    
  window.location.href = 'addcandidate.html';
 }
else
{

  alert('wrong id or password')
email.value="";
password.value="";

}


})