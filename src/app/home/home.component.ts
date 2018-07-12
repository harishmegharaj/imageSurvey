import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

import * as Survey from 'survey-angular';
import { WebApiObservableService } from '../service/web-api-observable.service';
import { defaultQuestionProperty } from '../service/defaultQuestionProperty';


declare var $: any;

var json_rec = [];
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {
  json: any;
  jsonReceived: any;
  model: any;
  surveyPages: any = [];
  imagePath: any;
  defaultQuestionID: any;
  intExtKey: any = [];
  showConfirm: boolean = true;
  loading:boolean = true;
  constructor(private router: Router,private restAPI: WebApiObservableService ) {

  }

  nextQuestion(){
    document.querySelector('#confirm_popup')['style']['display'] = "none";
    document.querySelector('#overlay')['style']['display'] = "none";
    window.location.reload();
  }

  close(){

    document.querySelector('#confirm_popup')['style']['display'] = "none";
    document.querySelector('#overlay')['style']['display'] = "none";
    sessionStorage.clear();

  }

  getQuestion(questions, param) {
    for (var key in questions) {
      var quepages = {
        "questions": []
      };
      if (questions.hasOwnProperty(key)) {
        var qarray = [];
        var questionObj = {
          "type": '',
          "renderAs": 'icheck',
          "isRequired": true,
          "name": '',
          "title": '',
          "choices": [],
          "keys": []
        };
        questionObj.type = questions[key].type == "radio" ? "radiogroup" : "checkbox";
        questionObj.name = questions[key].questionId;
        if (param === "default") {
          questionObj.title = questions[key].questiontext;
          this.defaultQuestionID = questions[key].questionId;
          for (var i in questions[key].options) {
            var val = questions[key].options[i];
            for (var j in val) {
                var sub_key = j;
                var sub_val = val[j];
            }
            this.intExtKey.push(sub_key);
        }
        } else if (param === "exterior") {
          questionObj.title = defaultQuestionProperty[questions[key].questionId][0];
          if(defaultQuestionProperty[questions[key].questionId][1]){
            questionObj["popupdescription"] = defaultQuestionProperty[questions[key].questionId][1];
          }
          questionObj['visibleIf'] = "{" + this.defaultQuestionID + "} = " + this.intExtKey[1];
        } else if (param === "interior") {
          questionObj.title = defaultQuestionProperty[questions[key].questionId][0];
          if(defaultQuestionProperty[questions[key].questionId][1]){
            questionObj["popupdescription"] = defaultQuestionProperty[questions[key].questionId][1];
          }
          questionObj['visibleIf'] = "{" + this.defaultQuestionID + "} = " + this.intExtKey[0];
        }

        for (var i in questions[key].options) {
          var val = questions[key].options[i];
          for (var j in val) {
            var sub_key = j;
            var sub_val = val[j];
          }

          var opt = sub_val;
          questionObj.choices.push(sub_key+'|'+opt);
          questionObj.keys.push(sub_key);
        }
        quepages.questions.push(questionObj);
        this.surveyPages.push(quepages);
      }

    }
  }

  processSurveyData(restApi) {

    this.imagePath = this.jsonReceived.imageUrl;
    var imageID = this.jsonReceived.imageId;
    var intQuestionCount, extQuestionCount;
   
    if (this.jsonReceived.defaultQuestion && this.jsonReceived.defaultQuestion.length) {
      this.getQuestion(this.jsonReceived.defaultQuestion, "default");
    }
    if (this.jsonReceived.defaultQuestion && this.jsonReceived.exteriorQuestions.length) {
      extQuestionCount = this.jsonReceived.exteriorQuestions.length;
      this.getQuestion(this.jsonReceived.exteriorQuestions, "exterior");
    }
    if (this.jsonReceived.defaultQuestion && this.jsonReceived.interiorQuestions.length) {
      intQuestionCount = this.jsonReceived.interiorQuestions.length;
      this.getQuestion(this.jsonReceived.interiorQuestions, "interior");
    }

    this.json = {
      title: "", showProgressBar: "top", pages: this.surveyPages
    };


    Survey.defaultBootstrapCss.navigationButton = "btn btn-primary";
    Survey.surveyStrings.requiredError = "Please answer the question";
    Survey.surveyStrings.completeText = "SUBMIT";
    Survey.surveyStrings.pagePrevText="PREVIOUS";
    Survey.surveyStrings.pageNextText="NEXT";
    Survey.surveyStrings.completingSurvey="";
    Survey.surveyStrings.progressText = "Question {0} of {1}";
    Survey.Survey.cssType = "bootstrap";
    Survey.JsonObject.metaData.addProperty("radiogroup", { name: "renderAs", default: "standard", choices: ["standard", "icheck"] });
    Survey.JsonObject.metaData.addProperty("checkbox", { name: "renderAs", default: "standard", choices: ["standard", "icheck"] });
    Survey.JsonObject.metaData.addProperty("questionbase", "popupdescription:text");

    var widget = {
      name: "icheck",
      isFit: function (question) {

        var iCheckQuestionTypes = [
          'radiogroup',
          'checkbox'
        ]
        return iCheckQuestionTypes.indexOf(question.getType()) >= 0;

      },
      isDefaultRender: true,
      isFirstTime:true,
      afterRender: function (question, el) {
        if(question.name=="8fca8211-1cc3-4fee-99aa-b8ecd61b1c44"){
          if(this.isFirstTime){
           document.getElementById('surveyProgress').innerText = "Question 1 of 7";
           document.querySelector('.progress-bar')['style']['min-width'] ="15%";
           this.isFirstTime=false;
                }
               }
        if(( question.name =="c8d14ada-475a-4f96-81e4-d29c3d128e86") || ( question.name =="4ad378f2-b8c6-4ee5-81ee-d3c5152eec31") ||(question.value ==="None")){
          document.querySelector('.lastQuestionInfo')['style']['display'] = "block";
        }else{
          document.querySelector('.lastQuestionInfo')['style']['display'] = "none";
        }

        var $el = $(el);
        $(el).find('input').data({
          "iCheck": undefined
        });
        $el.find('input').iCheck({
          checkboxClass: 'icheckbox_square-blue',
          radioClass: 'iradio_square-blue'
        });


         $el.find('input').on('ifChecked', function(event) {
          if (question.getType() === 'radiogroup') {
            question.customWidgetData.isNeedRender = true;
            question.value = event.target.value;

            if(question.value === '8fca8211-1cc3-4fee-99aa-b8ecd61b1c45') {
              document.getElementById('surveyProgress').innerText = "Question 1 of " + (intQuestionCount + 1);
            } else if (question.value === '8fca8211-1cc3-4fee-99aa-b8ecd61b1c46'){
              document.getElementById('surveyProgress').innerText = "Question 1 of "  + (extQuestionCount + 1);;
            } else if (question.value === '8fca8211-1cc3-4fee-99aa-b8ecd61b1c47'){
              if(!this.isFirstTime){
              document.getElementById('surveyProgress').innerText = "Question 1 of 1";
              }
            }
          }
          if (question.getType() === 'checkbox') {
            question.customWidgetData.isNeedRender = true;
            var array;
            if (!Array.isArray(question.value)) {
              array = [];
            } else {
              array = question.value;
            }

            var item = event.target.value;

            if (array.indexOf(item) === -1 ) {
              array.push(item);
            }

            question.value = array;
          }

        });
        $el.find('input').on('ifUnchecked', function(event) {
          if (question.getType() === 'checkbox') {
            question.customWidgetData.isNeedRender = true;
            if (!Array.isArray(question.value)) return;
            var item = event.target.value;
            var array = question.value;

            var index = array.indexOf(item);
            array.splice(index, 1);
            var obj = array.reduce(function(acc, cur, i) {
              acc[i] = cur;
              return acc;
            }, {});
            question.value = array;
          }
        });
        var select = function() {
          if (question.getType() === 'radiogroup' || question.getType() === 'checkbox') {
            $(el).find('input[value="' + question.value + '"]').iCheck('check');
          }

        }

        question.valueChangedCallback = select;
        select();
      },
      willUnmount: function (question, el) {
        var $el = $(el);
        $el.find('input').iCheck('destroy');
      }
    }

    Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
    this.json["questionTitleTemplate"] = "{title}";
    this.model = new Survey.ReactSurveyModel(this.json);

    this.model.onAfterRenderQuestion.add(function (survey, options) {
       if(!options.question.popupdescription) return;
        var br_line = document.createElement("br");
        var pdfRefSpan = document.createElement("a");
        pdfRefSpan.target="_blank";
        pdfRefSpan.href="http://localhost:8080/attachments/"+options.question.popupdescription;
        pdfRefSpan.className = "pdf_ref";
         pdfRefSpan.innerHTML = defaultQuestionProperty[options.question.name][1];
        //pdfRefSpan.innerHTML ='Condition ratings reference';
        //Add a button; */
        var btn = document.createElement("button");
        btn.className = "btn btn-info btn-xs pdf_icn";
        var question = options.question;
        btn.onclick = function() { window.open('http://localhost:8080/attachments/'+ options.question.popupdescription,); }
        var header = options.htmlElement.querySelector("h5");
        header.appendChild(br_line);
        header.appendChild(pdfRefSpan);
        header.appendChild(btn);
    });



    this.model.onComplete.add(function (result) {
      var finalJson = {
        "imageId": '',
        "questionAnswered": [],
        "email": "",
        "userId": ''
      };
      finalJson.imageId = imageID;
      finalJson.questionAnswered = [];

      Object.keys(result.data)
        .forEach(function eachKey(key) {
          var queAnsObj = {
            "questionId": '',
            "optionsSelected":[]
          };
          queAnsObj.questionId = key;
          if(typeof(result.data[key]) === 'string'){
            queAnsObj.optionsSelected.push(result.data[key]);
          } else {
            queAnsObj.optionsSelected = result.data[key];
          }


          finalJson.questionAnswered.push(queAnsObj);
        });

        //Below code sends the survey response
      restApi.createService('icSurvey/saveSurvey', finalJson).subscribe(
        result => {
          console.log("OK");
          document.querySelector('#image')['style']['display'] = "none";
          document.querySelector('.lastQuestionInfo')['style']['display'] = "none";
          window.location.reload();
        /*   setTimeout(function() {
            document.querySelector('#confirm_popup')['style']['display'] = "block";
            document.querySelector('#overlay')['style']['display'] = "block";

          }, 400); */
        }, error => {
          console.log("error occured while survey saving");
         })
    });
    this.doOnCurrentPageChanged(this.model);
    Survey.SurveyNG.render("surveyElement", { model: this.model , onCurrentPageChanged: this.doOnCurrentPageChanged});
  }

   doOnCurrentPageChanged(survey) {
     //document.getElementById('progressQuestions').innerText = "Question " + (survey.currentPageNo + 1);
     document.getElementById('surveyProgress').innerText = "Question " + (survey.currentPageNo + 1) + " of " + survey.visiblePageCount;
   }
  ngOnInit() {
    if(sessionStorage.getItem("JWToken")){
      this.restAPI.getService('icSurvey/getSurvey').subscribe(
        result => {
          if (!result.error) {
          this.loading = false;        
          setTimeout(function() {
            document.querySelector('#survey_img')['style']['display'] = "block";
          }, 100);
          this.jsonReceived = result.payload;
          this.processSurveyData(this.restAPI);
        }
        else{
          this.loading=false;
        //  console.log(result.errorCode);
          var errorMessge=result.message;
          document.querySelector('.ifError').innerHTML =errorMessge;
          document.querySelector('#survey_img')['style']['display'] = "none"; 
          document.querySelector('.ifError')['style']['display'] = "block"; 
          document.querySelector('.opt_cont')['style']['display']="none";
         document.querySelector('.opt_cont')['style']['background']="#F3F3F3";
          //"#F3F3F3";
      }
      }, error => {  console.log(error.message)
                        
                          alert(error.message);
                         })
    } else{
      this.router.navigate(['/login']);
    }

  }

  ngOnDestroy() {
  }

}
