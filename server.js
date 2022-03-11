(function myLoop(i) {
    setTimeout(function () {
        console.log("<================================ Bloody Hell !!!!!!!! This works !!!!!!!! =======================> ", i)
        if (--i) myLoop(i); 
    }, 3000)
})(99999)