
function chessPlayerMoves(j,k){
  let res=[]
  let x = [1, 1, -1, -1, 2, 2, -2, -2];
  let y = [2, -2, 2, -2, 1, -1, -1, 1];
  for (let i = 0; i < 8; i++) {
    let l = j + x[i];
    let m = k + y[i];
    if(l>=0 && m>=0 &&l<8 &&m<8)
    res.push([l, m]);
  }
  return res
}


let res2 = []
document.body.addEventListener("click",(e)=>{
  let value = e.target.innerText
  let intList = value.split(",").map(x=>parseInt(x))
  
  let res1 = chessPlayerMoves(...intList)
  console.log(res1)
  document.getElementById("res").innerText = `${res1}`
})

