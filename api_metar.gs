function myFunction() {
  const bases = [
    "SBGR", //GRU
    "SBKP", //VCP
    "SBGL", //GIG
    "SBEG", //MAO
    "SBCA", //CAC
    "SBDN", //PPB
  ];

  const ss = SpreadsheetApp.getActiveSpreadsheet()
  ss.getSheetByName("v3").getRange("D2:D").setValue("");
  ss.getSheetByName("v3").getRange("H2:K").setValue("");


  Logger.log([bases]);

  let apiURL = `https://api.checkwx.com/metar/`+[bases]+`/decoded?x-api-key=5a715b5123c841c5b1d4355774`

  Logger.log(apiURL);

  const getContent = UrlFetchApp.fetch(apiURL).getContentText();
  const responseHTTP = UrlFetchApp.fetch(apiURL).getResponseCode();
  Logger.log(responseHTTP);
  const responseMetar = JSON.parse(getContent);
  //Logger.log(responseMetar)

//[SBCA 0, SBDN 1, SBEG 2, SBGL 3, SBGR 4, SBKP 5]
  var baseA = responseMetar.data[0]; //CAC
  var baseB = responseMetar.data[1]; //PPB
  var baseC = responseMetar.data[2]; //MAO
  var baseD = responseMetar.data[3]; //GIG
  var baseE = responseMetar.data[4]; //GRU
  var baseF = responseMetar.data[5]; //VCP

  Logger.log([baseA, baseB, baseC, baseD, baseE, baseF]);
  Logger.log(bases.length);

  for (var i = 0; i < bases.length; i++){
    var metarRaw = [responseMetar.data[i].raw_text]
    var base = [responseMetar.data[i].icao];
    base.forEach(function (value){
      var rowNumber = i+2;
      //console.log("M"+ rowNumber);
      ss.getSheetByName("v3").getRange("A"+rowNumber).setValue(value);
      ss.getSheetByName("v3_msgs").getRange("M"+rowNumber).setValue(metarRaw);
      var now = new Date();
      var dateFormat = Utilities.formatDate(now, "GMT-3", 'MMMM dd, yyyy HH:mm:ss Z');
      ss.getSheetByName("v3").getRange("N"+rowNumber).setValue(new Date(dateFormat));
    });

var vento = responseMetar.data[i].wind ? [responseMetar.data[i].wind.speed_kph] : undefined;
    if(vento == undefined) {
      console.log("sem vento reportado");
    } else {
    console.log("vento de -> " + vento);
    var metarRaw = [responseMetar.data[i].raw_text];
    vento.forEach(function (value){
      Utilities.sleep(500);
      var rowNumber = i+2;
      console.log(metarRaw);
      ss.getSheetByName("v3").getRange("B"+rowNumber).setValue(value);
      ss.getSheetByName("v3_msgs").getRange("B2").setValue(value);
      var metarGravado = ss.getSheetByName("v3").getRange("M"+rowNumber).getValue();

      if (vento >=44 && vento <=66 && metarRaw != metarGravado) {
        console.log ("FOI VENTO AMARELO");
        //console.log(metarRaw);
        ss.getSheetByName("v3").getRange("H"+rowNumber).setValue("AMARELO");
        var numero_base = ss.getSheetByName("v3").getRange("L"+rowNumber).getValue();
        var imagem = "https://drive.google.com/uc?id=13sEeEyHswGRm7GVuO7EP82B0ZNnV_1ma"
        var mensagem = ss.getSheetByName("v3_msgs").getRange("D2").getValue();
        //console.log(mensagem);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+mensagem+"&file="+imagem+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+metarRaw+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        //console.log(numero_base);
        ss.getSheetByName("v3").getRange("M"+rowNumber).setValue(metarRaw);
      } else {
        console.log("Não ha alerta de vento amarelo!");
      };
      if (vento >66 && vento <=104 && metarRaw != metarGravado) {
        console.log("FOI VENTO LARANJA");
        ss.getSheetByName("v3").getRange("H"+rowNumber).setValue("LARANJA");
        var numero_base = ss.getSheetByName("v3").getRange("L"+rowNumber).getValue();
        var imagem = "https://drive.google.com/uc?id=13mlQMiysVvkuFwOdjPRzL3mrsFaJF4s7";
        var mensagem = ss.getSheetByName("v3_msgs").getRange("E2").getValue();
        //console.log(mensagem);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+mensagem+"&file="+imagem+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+metarRaw+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        ss.getSheetByName("v3").getRange("M"+rowNumber).setValue(metarRaw);
        //console.log(numero_base);
      } else {
        console.log("Não ha alerta de vento laranja!");
      };
      if (vento >104 && metarRaw != metarGravado) {
        console.log("FOI VENTO VERMELHO");
        ss.getSheetByName("v3").getRange("H"+rowNumber).setValue("VERMELHO");
        var numero_base = ss.getSheetByName("v3").getRange("L"+rowNumber).getValue();
        var imagem = "https://drive.google.com/uc?id=13qq5dFFb3znKK8s6kaM29Y2_Q8eknM4j";
        var mensagem = ss.getSheetByName("v3_msgs").getRange("F2").getValue();
        //console.log(mensagem);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+mensagem+"&file="+imagem+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+metarRaw+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        ss.getSheetByName("v3").getRange("M"+rowNumber).setValue(metarRaw);
        //console.log(numero_base);
      } else {
        console.log("Não ha alerta de vento vermelho!");
      }
    })};

//RAJADAS

    var rajada = responseMetar.data[i].wind ? [responseMetar.data[i].wind.gust_kph] : undefined;
    if(rajada === undefined) {
      console.log("sem rejadas reportadas");
    } else {
    rajada.forEach(function (value){
      console.log(value);
      Utilities.sleep(500);
      var rowNumber = i+2;
      console.log(metarRaw);
      ss.getSheetByName("v3").getRange("B"+rowNumber).setValue(value);
      ss.getSheetByName("v3_msgs").getRange("C2").setValue(value);
      var metarGravado = ss.getSheetByName("v3").getRange("M"+rowNumber).getValue();
      if (value == null) {
      ss.getSheetByName("v3_msgs").getRange("C2").setValue(0);
      ss.getSheetByName("v3").getRange("C"+rowNumber).setValue(0);
      } ;
      if (value >=44 && value <=66 && metarRaw != metarGravado) {
        console.log ("VENTO AMARELO POR CONTA DE RAJADAS");
        //console.log(metarRaw);
        ss.getSheetByName("v3").getRange("H"+rowNumber).setValue("AMARELO");
        var numero_base = ss.getSheetByName("v3").getRange("L"+rowNumber).getValue();
        var imagem = "https://drive.google.com/uc?id=13sEeEyHswGRm7GVuO7EP82B0ZNnV_1ma"
        var mensagem = ss.getSheetByName("v3_msgs").getRange("D2").getValue();
        //console.log(mensagem);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+mensagem+"&file="+imagem+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+metarRaw+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        //console.log(numero_base);
        ss.getSheetByName("v3").getRange("M"+rowNumber).setValue(metarRaw);
      } else {
        console.log("Não há alerta de vento amarelo por conta de rajadas")
      };
      if (value >=66 && value <=104 && metarRaw != metarGravado) {
        console.log("VENTO LARANJA POR CONTA DE RAJADAS");
        ss.getSheetByName("v3").getRange("H"+rowNumber).setValue("LARANJA");
        var numero_base = ss.getSheetByName("v3").getRange("L"+rowNumber).getValue();
        var imagem = "https://drive.google.com/uc?id=13mlQMiysVvkuFwOdjPRzL3mrsFaJF4s7";
        var mensagem = ss.getSheetByName("v3_msgs").getRange("E2").getValue();
        //console.log(mensagem);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+mensagem+"&file="+imagem+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+metarRaw+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        ss.getSheetByName("v3").getRange("M"+rowNumber).setValue(metarRaw);
        //console.log(numero_base);
      } else {
        console.log("Não ha alerta de vento laranja por conta de rajadas");
      };
      if (value > 104 && metarRaw != metarGravado) {
        console.log("VENTO VERMELHO POR CONTA DE RAJADAS");
        ss.getSheetByName("v3").getRange("H"+rowNumber).setValue("VERMELHO");
        var numero_base = ss.getSheetByName("v3").getRange("L"+rowNumber).getValue();
        var imagem = "https://drive.google.com/uc?id=13qq5dFFb3znKK8s6kaM29Y2_Q8eknM4j";
        var mensagem = ss.getSheetByName("v3_msgs").getRange("F2").getValue();
        //console.log(mensagem);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+mensagem+"&file="+imagem+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+metarRaw+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        ss.getSheetByName("v3").getRange("M"+rowNumber).setValue(metarRaw);
        //console.log(numero_base);
      } else {
        console.log("Não ha alerta de vento vermelho por conta de rajadas");
      };
    })};

    var condicaoRaw = Array.apply(null, responseMetar.data[i].conditions);
    condicaoRaw.forEach(function (value){
      Utilities.sleep(500);
      Logger.log(responseMetar.data[i].icao + " --> " +value["prefix"]);
      var rowNumber = i+2;
      var metarGravado = ss.getSheetByName("v3").getRange("M"+rowNumber).getValue();
      ss.getSheetByName("v3").getRange("D"+rowNumber).setValue(value["text"])

      if (value["code"].includes("TS") && value["prefix"] == "VC" && metarRaw != metarGravado) {
        console.log("FOI RAIO LARANJA");
        ss.getSheetByName("v3").getRange("G"+rowNumber).setValue("Nas Proximidades");
        ss.getSheetByName("v3").getRange("J"+ rowNumber).setValue("LARANJA");
        var numero_base = ss.getSheetByName("v3").getRange("L"+rowNumber).getValue();
        var imagem = "https://drive.google.com/uc?id=14PYO8ib9UbI1yNKeKV495SK0TYpmBpmm";
        var mensagem = ss.getSheetByName("v3_msgs").getRange("E3").getValue();
        console.log(mensagem);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+mensagem+"&file="+imagem+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+metarRaw+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        console.log(numero_base);
        ss.getSheetByName("v3").getRange("M"+rowNumber).setValue(metarRaw);
      } else {
        ss.getSheetByName("v3").getRange("G"+rowNumber).setValue("");
        ss.getSheetByName("v3").getRange("J"+ rowNumber).setValue("");
        console.log("Não ha alerta de raio laranja!");
      };
      if (value["code"].includes("TS") && value["prefix"] != "VC" && metarRaw != metarGravado) {
        console.log("FOI RAIO VERMELHO");
        ss.getSheetByName("v3").getRange("G"+rowNumber).setValue("Na Localidade");
        ss.getSheetByName("v3").getRange("J"+ rowNumber).setValue("VERMELHO");
        var numero_base = ss.getSheetByName("v3").getRange("L"+rowNumber).getValue();
        var imagem = "https://drive.google.com/uc?id=14LvZ-dCvPv4XRfpu3wpaE-MKRud7A6-F";
        var mensagem = ss.getSheetByName("v3_msgs").getRange("F3").getValue();
        console.log(mensagem);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+mensagem+"&file="+imagem+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+metarRaw+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        console.log(numero_base);
        ss.getSheetByName("v3").getRange("M"+rowNumber).setValue(metarRaw);
      } else {
        ss.getSheetByName("v3").getRange("G"+rowNumber).setValue("");
        ss.getSheetByName("v3").getRange("J"+ rowNumber).setValue("");
        console.log("Não ha alerta de raio vermelho!");
      };
      if ((value["code"] == "RA" || value["code"] == "TSRA")  && value["prefix"] == "-" && metarRaw != metarGravado) {
        console.log("CHUVA LEVE " + base);
        ss.getSheetByName("v3").getRange("I"+rowNumber).setValue("AMARELO");
        var numero_base = ss.getSheetByName("v3").getRange("L"+rowNumber).getValue();
        var imagem = "https://drive.google.com/uc?id=13vCGsIu22naY7bmUH-QjKtBUNj6LRdwr";
        var mensagem = ss.getSheetByName("v3_msgs").getRange("D5").getValue();
        console.log(mensagem);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+mensagem+"&file="+imagem+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+metarRaw+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        console.log(numero_base);
        ss.getSheetByName("v3").getRange("M"+rowNumber).setValue(metarRaw);
      } else {
        ss.getSheetByName("v3").getRange("I"+rowNumber).setValue("");
        console.log("Não ha alerta de chuva amarelo!");
      };
      if ((value["code"] == "RA" || value["code"] == "TSRA") && value["prefix"] == null && metarRaw != metarGravado) {
        console.log("CHUVA MODERADA " + base);
        ss.getSheetByName("v3").getRange("I"+rowNumber).setValue("LARANJA");
        var numero_base = ss.getSheetByName("v3").getRange("L"+rowNumber).getValue();
        var imagem = "https://drive.google.com/uc?id=13vdiw-T1u2pSFAujk7ZwMy1BNTyRzHOp";
        var mensagem = ss.getSheetByName("v3_msgs").getRange("E5").getValue();
        console.log(mensagem);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+mensagem+"&file="+imagem+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+metarRaw+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        console.log(numero_base);
        ss.getSheetByName("v3").getRange("M"+rowNumber).setValue(metarRaw);
      } else {
        ss.getSheetByName("v3").getRange("I"+rowNumber).setValue("");
        console.log("Não ha alerta de chuva laranja!");
        console.log(value["code"] == "TSRA")
      };
      if ((value["code"] == "RA" || value["code"] == "TSRA") && value["prefix"] == "+" && metarRaw != metarGravado) {
        console.log("CHUVA FORTE " + base);;
        ss.getSheetByName("v3").getRange("I"+rowNumber).setValue("VERMELHO");
        var numero_base = ss.getSheetByName("v3").getRange("L"+rowNumber).getValue();
        var imagem = "https://drive.google.com/uc?id=14DL3S5Uy5XqY3G2QCTpRKcHXPvz79BBv";
        var mensagem = ss.getSheetByName("v3_msgs").getRange("F5").getValue();
        console.log(mensagem);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+mensagem+"&file="+imagem+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        Utilities.sleep(6*1000);
        UrlFetchApp.fetch("http://api.textmebot.com/send.php?text="+metarRaw+"&apikey=AgPQ6KDCYLKB&recipient="+numero_base);
        console.log(numero_base);
        ss.getSheetByName("v3").getRange("M"+rowNumber).setValue(metarRaw);
      } else {
        ss.getSheetByName("v3").getRange("I"+rowNumber).setValue("");
        console.log("Não ha alerta de chuva vermelho!");
      };
      if (condicaoRaw == undefined) {
        console.log ("Sem condição advsersa");
      };
    });
    var visibilidade = [responseMetar.data[i].visibility.meters_float];
    visibilidade.forEach(function (value){
      console.log(visibilidade);
      Utilities.sleep(500);
      var rowNumber = i+2;
      ss.getSheetByName("v3").getRange("F"+rowNumber).setValue(value);
      var metarGravado = ss.getSheetByName("v3").getRange("M"+rowNumber).getValue();
      if (visibilidade <= 90.0 && metarRaw != metarGravado) {
        //vermelho      
        ss.getSheetByName("v3_msgs").getRange("B4").setValue(value);
      };
      if (visibilidade >90.0 && visibilidade <= 270.0 && metarRaw != metarGravado) {
        // laranja
        ss.getSheetByName("v3_msgs").getRange("B4").setValue(value);
      };
      if (visibilidade > 270.0 && visibilidade <=600.0 && metarRaw != metarGravado) {
        //amarelo
        ss.getSheetByName("v3_msgs").getRange("B4").setValue(value);
      };
    });
    
  }
}
