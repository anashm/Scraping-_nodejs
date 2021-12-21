const express = require('express')
const app =express()
const cheerio = require('cheerio')
const axios = require('axios')



async function getMovies(){

  try {
    
    const siteUrl = 'https://www.imdb.com/chart/top/?ref_=nv_mv_250'

    const website_data = await axios({
      method : 'GET',
      url : siteUrl
    })
    const $ = cheerio.load(website_data.data)
    const element_selector = "#main > div > span > div > div > div.lister > table > tbody > tr"


    const keys = [
     
      'Movie',
      'imdbRating'
    ]

    var array_final = []

    $(element_selector).map( (index,element) =>{
      var child_index = 0;
      var child_object = {}
      //var array_final = []
        if(index < 10 ){
          
          $(element).children().map((childIndex,childElement)=>{
            const tdValue = $(childElement).text().trim();
            if(tdValue && childIndex <= 2){
              //console.log(tdValue.replace(/\s+/g, ''))
              child_object[keys[child_index]] = tdValue.replace(/\s+/g, '')
              child_index ++
              //console.log(childIndex)
              
            }
            
          })

          array_final.push(child_object)
         // console.log(child_object)
      }
      
    })

    return array_final
   

  } catch (error) {
    console.log(error)
  }
}

getMovies()



app.get('/' , async(req,res) => {

    try {
      const ratesMovies = await getMovies()

      return res.status(200).json({
        response : ratesMovies
      })

    } catch (error) {
      return res.status(500).json({
        err : error
      })
    }
})


  
app.listen(7000 , () => {
  console.log('server running')
})