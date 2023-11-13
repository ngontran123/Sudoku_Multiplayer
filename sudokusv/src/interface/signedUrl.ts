interface SignatureOptions
{
    secrect:string,
    ttl?:number,
    hash?:string
}

interface SignatureData
{
    exp?:number,
    rndNumber?:string
}

export {SignatureData,SignatureOptions};
