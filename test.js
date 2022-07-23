// console.log(typeof undefined)

// console.log(typeof null)



// // // function foo(){
// // //     function bar(){
// // //         return 2;
// // //     }
// // //     return bar();
// // //     function bar(){
// // //         return 11;
// // //     }
// // // }
// // // console.log(foo());

// // function sum(a=10,b=20){
// //     var add1=0;
// //     add1=a+b;
// //     console.log(add1);
// // }

// // sum();
// // sum(2,3);
// // sum(2);


var a={
    a:4,
    b:{
        a:1,
        c:function(){
            console.log(this.a)
        }
    }
}

a.b.c()