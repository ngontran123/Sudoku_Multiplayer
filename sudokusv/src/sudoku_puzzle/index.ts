export class SudokuPuzzle
{
    n:number;
    k:number;
    sqn:number;
    arr=[]
    arr1=[]
    constructor(n,k){
        this.n=n;
        this.k=k;
        var srnd
        var arr=[]
        srnd=Math.sqrt(n)
        this.sqn=Math.round(srnd)
        for(let i=0;i<n;i++)
        {  let ar1=[]
            for(let j=0;j<n;j++)
            {
                ar1.push(0)
            }
          arr.push(ar1)
        }
        this.arr=arr
    };
    public fillValues():void{
    this.fillDiagonal();
    this.fillRemaining(0,0);
     }
  public randomNumber(n):number
  {
    return Math.floor((Math.random()*n+1));
  }
  public unUsedCol(j,num):boolean
  {
   for(let i=0;i<this.n;i++)
   {
     if(this.arr[i][j]===num)
     {
       return false
     }
   }
   return true
  }
  public unUsedRow(i,num):boolean
  {
      for(let j=0;j<this.n;j++){
        if(this.arr[i][j]===num){
          return false;
        }
      }
      return true;
  }
  public unUsedBox(rows,cols,num):boolean
  {
    for(let i=0;i<this.sqn;i++){
      for(let j=0;j<this.sqn;j++)
      {
        if(this.arr[rows+i][cols+j]===num)
        {
          return false;
        }
      }
    }
    return true;
  }
  public checkIfSafe(i,j,num):boolean{
    return(this.unUsedCol(j,num)&&this.unUsedRow(i,num)&&this.unUsedBox(i-i%this.sqn,j-j%this.sqn,num))
  }
  public fillBox(row,column):void
  {
   for(let i=0;i<this.sqn;i++)
   {
     for(let j=0;j<this.sqn;j++)
     {
       do{
          var num:number
         num=this.randomNumber(this.n)
       }
       while(!this.unUsedBox(row,column,num))
       this.arr[row+i][column+i]=num
     }
   }
  }
   public fillDiagonal():void{
     for(let i=0;i<this.n;i+=this.sqn)
     {
       this.fillBox(i,i)
     }
   }
   public fillRemaining(i,j):boolean{
     if(i>=(this.n-1)&&j>=this.n)
     {
       return true
     }
     if(j===this.n)
     {
      i++;
      j=0;
     }
  if(this.arr[i][j]!==0)
  {
    return this.fillRemaining(i,j+1);
  }
   for(let num=1;num<=9;num++)
   {
     if(this.checkIfSafe(i,j,num))
     {
       this.arr[i][j]=num;
       if(this.fillRemaining(i,j+1))
       {
         return true;
       }
     }
     this.arr[i][j]=0;
   }
   return false;
   }
   public removeKDigits(k:number):void{
    var count:number
    count=k
    while(count!==0)
    {
      let cellId=this.randomNumber(81)-1
      var i:number
      var j:number
      i=Math.floor(cellId/9)
      j=(cellId%9)
      if(j!==0)
      {
         j=j-1;
      }    
      if(this.arr[i][j]!==0)
      {
        count-=1
        this.arr[i][j]=0
      }
    }
   }
   public returnArray()
   {
     return this.arr;
   }
  }
