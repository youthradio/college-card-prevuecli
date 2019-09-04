/*globals Vue, d3 */
// spreadsheet data, google shares a public web version based on the original document
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRaNDBN4NpVISkVvaKK_FPQSwRZorhpIKb0bsaPTm0gKwvVviTHvcpHJsr5erVrjpiPH9YZupinUljz/pub?gid=0&single=true&output=csv"
const a = document.getElementById("result")
let iFrameSize = document.documentElement.scrollHeight
// this grabs the data and transform to a nice array of options, responses
/*
{
  "topic": "Academic Pace",
  "options": [
    {
      "option": "Intense",
      "response": "You choose an {{academic_pace}} academic pace"
    },
    {
      "option": "Medium",
      "response": "You choose a {{academic_pace}} academic pace"
    },
    {
      "option": "Relaxed",
      "response": "You choose a {{academic_pace}} academic pace"
    }
  ]
}
*/
new Vue({
  el: '#app',
  data(){
    return{
      questionsData : null,
      isReadyToResult : false,
      showResult: false,
      answeredQuestions: [],
    }
  },
  mounted() {
    this.loadData(); //get data
  },
  watch: {
    answeredQuestions(){
      this.isReadyToResult = true;
    },
    showResult(){

    }
  },
  computed:{
    resultStatements(){
      return this.answeredQuestions.map(response => response.response.replace(/\{\{.*\}\}/g, response.option.toLowerCase()))
    }
  },
  methods: {
    async loadData(){
      const data = await d3.csv(sheetURL).then((data) => {
        data = data.filter(e => e.TOPIC !== "")
        return d3.nest()
          .key(d => d.TOPIC) 
          .entries(data);
      });
      console.log(data)
      this.questionsData =  data.map( e => ({
        topic: e.key,
        headline: e.values[0] ? e.values[0].Headline : '', 
        options: e.values.map(o => ({
          option: o.OPTIONS,
          response: o.RESPONSES  
        }))
      }))
    },
    processResult(){
      this.showResult = true;
      console.log(this.refs);
      // nextTick() waits for the next update cycle, very useful for focusing on new DOM objects.
      Vue.nextTick(() => this.$refs.result.scrollIntoView({behavior: 'smooth'}));

    },
    printPage: function(){
      window.print()
    }
  },
})

window.addEventListener('resize', function(){
  iFrameSize = document.documentElement.scrollHeight
})


