let finalArr = [];

function callAPI() {
    //Accept the number of advice you need
    let number = document.getElementById("adviceNum").value;
    finalArr = [];
    //clear the result div
    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    //input number between 5 - 20 only
  if (number <= 20 && number >= 5) {
    let promiseArr = [];
      let resultArr = [];
      //Collect all the requests in a promiseArr and
      //Call the advice api using getAdvice method
    for (let i = 1; i <= number; i++) {
      promiseArr.push(getAdvice(i));
    }

      Promise.all(promiseArr).then((res) => {
        //Send all the advices received from 1st API
        //to get the translated version through getTranslatedText
      for (let i = 0; i < res.length; i++) {
        resultArr.push(getTranslatedText(res[i].slip));
      }
        //sort the data with the ID
      Promise.all(resultArr).then((data) => {
        finalArr.sort((a, b) => {
          return a.id - b.id;
        });

         //display the final output 
        finalArr.forEach((element) => {
          let childDiv = document.createElement("div");
          childDiv.className = "advice";
          childDiv.innerHTML = `
          <span>${element.advice}</span><br />
          <span>${element.translated}</span>
        `;
            resultDiv.appendChild(childDiv);
        });
      });
    });
  } else {
    alert("Kindly enter a number between 5 and 20");
  }
}

function getAdvice(index) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.adviceslip.com/advice/${index}`)
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
      });
  });
}

function getTranslatedText(obj) {
  return new Promise((resolve, reject) => {
      fetch("https://translate.argosopentech.com/translate", {
      method: "POST",
      body: JSON.stringify({
        q: obj.advice,
        source: "en",
        target: "pl",
        format: "text",
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        finalArr.push({
          id: obj.id,
          advice: obj.advice,
          translated: data.translatedText,
        });
        resolve(data);
      });
  });
}
