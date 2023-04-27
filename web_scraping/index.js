const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const {response} = require("express");
const PORT = 5000

const app = express()

async function webScraping() {
    const url = "https://www.nssi.bg/"
    const calendarArr = []
    await axios(url).then((response) => {
        const html_data = response.data
        const $ = cheerio.load(html_data)
        const selectedElement = "#post-21 > div > div > div.fl-row.fl-row-full-width.fl-row-bg-color.fl-node-c9vhnar82mlx.fl-row-bg-attachment-scroll > div > div > div > div.fl-col.fl-node-6pvsku0i7gxm.fl-col-small > div > div.fl-module.fl-module-html.fl-node-9dycf5jpxez6 > div > div"
        const keys = [
            "Date",
            "Description"
        ]
        $(selectedElement).each((parentIndex, parentElem) => {
            let keyIndex = 0
            const calDetails = {}
            if (parentIndex <= 5) {
                $(parentElem).children().each((childId, childElem) => {
                    const value = $(childElem).text()
                    if (value) {
                        calDetails[keys[keyIndex]] = value
                        keyIndex++
                    }
                })
                calendarArr.push(calDetails)
            }
        })
    })
    return calendarArr
}

app.get('/nssi/calendar', async (req, res) => {
    try {
        const calendar = await webScraping()
        return res.status(200).json({
            result: calendar
        })
    } catch (err) {
        return res.status(500).json({
            err: err.toString()
        })
    }
})

app.listen(PORT, () => console.log(`Server running on Port ${PORT}`))