export class ServiceHelper
{
    private randomNumber(n):number
    {
      return Math.floor((Math.random()*n+1))
    }
    public removeKDigits(arr,k:number)
    {
      var count;
      count=k;
      while(count!==0)
      {
        let cellId=this.randomNumber(81)-1;
        var i;
        var j;
        i=Math.floor(cellId/9)
        j=(cellId%9)
        if(j!==0)
        {
           j=j-1;
        }    
        if(arr[i][j]!==0)
        {
          count-=1
          arr[i][j]=0
        }
      }
      return arr;
     }
     public convert2DArray(arr)
     {
      var ar=[];
      for(let i=0;i<9;i++)
      { ar[i]=[];
        for(let j=0;j<9;j++)
        {
         ar[i][j]=arr[i][j];
        }  
      }
      return ar;
     }
}