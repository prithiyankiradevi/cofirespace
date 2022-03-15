async function paginated(model,pages,limits,calledFrom,searchParam,res){
    try{
        var page=parseInt(pages)
        var limit=parseInt(limits)
        var startIndex=(page-1)*limit
        var endIndex=page*limit
        let result={}
        // console.log(startIndex)
        // console.log(endIndex)
        // console.log(await model.find({}).count())

        if(endIndex<await model.find({}).count()){
            result.next={
                page:page+1,
                limit:limit
            }
        }
        if(startIndex>0){
            result.previous={
                page:page-1,
                limit:limit
            }
        }
        await checkCalledFromAndExecute(model,limit,calledFrom,result,startIndex,searchParam)
        return result
    }catch(e){
        res.status(500).send({message:'internal server error'})
    }
}

async function checkCalledFromAndExecute(model,limit,calledFrom,result,startIndex,searchParam){
    if(calledFrom=='pageWithLimit'){
        result.total_of_datas=await model.find({}).count()
        result.filteredResult=await model.find({deleteFlage:false}).limit(limit).skip(startIndex)
    }
    if(calledFrom=='limitWithTextSearch'){
        result.total_of_datas=await model.find({}).count()
        const filterFromCitys =await model.find({},{city:1,_id:0}).limit(limit).skip(startIndex)
        const filterCity=Object.values(filterFromCitys).map((result)=>result.city)
        result.filterfromcity=filterCity


        const filterFromSpace=await model.find({},{cofirespaceName:1,_id:0}).limit(limit).skip(startIndex)
        const filterspace=Object.values(filterFromSpace).map((space)=>space.cofirespaceName)
        result.filterfromspace=filterspace
    }
}


module.exports={
    paginated
}