//Model
// Map Locations

// make markers observables.

var Model = {
    locations: [{
        title: 'El Famous Burrito',
        location: {
            lat: 42.149870,
            lng: -87.915673
        },
        city: 'Wheeling',
        yelpId: 'el-famous-burrito-wheeling'
    }, {
        title: 'Rocky\'s Tacos',
        location: {
            lat: 42.011598,
            lng: -87.663256
        },
        city: 'Chicago',
        yelpId: 'rockys-tacos-chicago-2'
    }, {
        title: 'Taco Nano!',
        location: {
            lat: 42.100821,
            lng: -87.768499
        },
        city: 'Northfield',
        yelpId: "taco-nano-northfield"
    }, {
        title: 'Burrito House',
        location: {
            lat: 42.040016,
            lng: -87.826469
        },
        city: 'Niles',
        yelpId: "burrito-house-niles"
    }, {
        title: 'Tacos El Norte',
        location: {
            lat: 42.207408,
            lng: -87.812835
        },
        city: 'Highwood',
        yelpId: "tacos-el-norte-highwood"
    }],

    vm: {
        array: ko.observableArray(),
        citys: ko.observableArray(),
        yelpId: ko.observableArray(),
        dropDown: ko.observable(),
        markerSelect: ko.observable(),
        navOpenNum: ko.observable(),

        display: ko.observable(true),
        yelpRating: ko.observable()


    },
    markers: [],
    map: {}




};


var yelpRating;

//View

var initMap = function() {




    ko.applyBindings(Model.vm);

    var viewmodel = new ViewModel();



    var menu = document.querySelector('#menu');
    var main = document.querySelector('main');
    var drawer = document.querySelector('#drawer');
    //var yelpRating;


    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 42.012763,
            lng: -87.666944
        },
        zoom: 12
    });


    // Declaring Knockout.JS observables and applying bindings




    var largeInfowindow = new google.maps.InfoWindow();

    var bounds = new google.maps.LatLngBounds();

    // This loop sets up all map locations and drops markers
    for (var i = 0; i < Model.locations.length; i++) {

        var position = Model.locations[i].location;

        var title = Model.locations[i].title;

        var yelpId = Model.locations[i].yelpId;



        // adding locations to array
        Model.vm.array.push(Model.locations[i].title);
        // adding city names to array
        Model.vm.citys.push(Model.locations[i].city);
        //adding yelp id to array
        Model.vm.yelpId.push(Model.locations[i].yelpId);




        var marker = new google.maps.Marker({
            Icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            position: position,
            title: title,
            yelpId: yelpId,

            animation: google.maps.Animation.DROP,

            id: i
        });

        Model.markers.push(marker);

        Model.markers[i].setMap(map);
        bounds.extend(Model.markers[i].position);



        marker.addListener('click', function() {
          for (var b = 0; b < Model.markers.length; b++) {
                        Model.markers[b].setMap(map);
                        Model.markers[b].setIcon('https://maps.google.com/mapfiles/ms/icons/red-dot.png');

 //console.log(Model.vm.markerSelect());
                    }

          this.setIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png');
            populateInfoWindow(this, largeInfowindow);


      });
Model.vm.dropDown.subscribe(function(){
  var z = document.getElementById("markerSelect").innerHTML;
  //console.log(z);

if( z == -1){
  //Do Nothing, No errors!
}
else{
populateInfoWindow(Model.markers[z], largeInfowindow);

}
});


        map.fitBounds(bounds);
        //drop marker
    }

};



function populateInfoWindow(marker, infowindow) {


    //Check to make sure the infowindow is not already opened on this marker.
    var z = document.getElementById("markerSelect").innerHTML;
    //console.log(z);

//if(Model.vm.markerSelect == "")
//{

//}


    if (z == -1){
//console.log('Did It!');
  for (var b = 0; b < Model.markers.length; b++) {
infowindow.close(map, Model.markers[b]);
Model.vm.markerSelect("");
Model.



console.log("I ran ?")
  }
    }
else{



    if (infowindow.marker != marker) {
        infowindow.marker = marker;




        callYelpAPI(marker.id);
        infowindow.setContent('<div style="font-size: large; font-family: Times New Roman", Times, serif;">' + marker.title + '</div> <br>' +
            '<img src="images/yelp-2c.png" alt="Yelp Logo" style="width:120px;height:70px;">' +
            '<div id="ratestars"></div> ');

        //callYelpAPI(marker.id)

        infowindow.open(map, marker);
        //infowindow.close(map, marker);

        //Make sure the marker property is cleared if the infowindow is closed.

        infowindow.addListener('closeclick', function(){
          marker.infowindow.close();
          marker.setIcon('https://maps.google.com/mapfiles/ms/icons/red-dot.png');
          });
  }


}
}


function callYelpAPI(i) {

    function nonce_generate() {
        return (Math.floor(Math.random() * 1e12).toString());
    }




    var parameters = {
        oauth_consumer_key: 'h7e9cHmibtiOAeUH_GJ1QA', //consumer key
        oauth_token: 'CQpP53MNeigAwK1wYmhwaguuc5I3GvEB', // Token
        oauth_nonce: nonce_generate(),
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0',
        callback: 'cb',
        //term:  'Tacos El Norte',
        //location: 'Highwood,Il'
        //  id: 'tacos-el-norte-highwood'
        id: Model.locations[i].yelpId


    };
    //Consumer Secret         //Token Secret
    var yelp_url = 'https://api.yelp.com/v2/' + 'business/' + parameters.id;

    //var yelp_url = 'https://api.yelp.com/v2/' + 'search/';

    var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, '3fH3EJysPQ0Am-C2miz4G_tzirE', '6Vqup-75LvlpqctaNZYerug_rbw');
    parameters.oauth_signature = encodedSignature;

    var settings = {
        url: yelp_url,
        data: parameters,
        cache: true, // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
        dataType: 'jsonp',
        success: function(results) {
            successCallback(results);
        },
        error: function(results) {
            errorCallback(results);
            console.log(results);
            // Do stuff on fail
        }
    };

    // Send AJAX query via jQuery library.
    $.ajax(settings);


}


function successCallback(response) {
    yelpRating = response.rating;
    var ratingElement = document.getElementById('ratestars');


    var wholeStars = 0;
    var halfStar = 0; //.5
    var wholeStars = Math.floor(yelpRating / 1);
    var halfStar = yelpRating % 1; //.5




    for (var a = 0; a < wholeStars; a++) {

        var img = document.createElement("img");
        img.src = 'images/19x19_5.png';
        ratingElement.appendChild(img);

    }


    if (halfStar === .5) {

        var img = document.createElement("img");
        img.src = 'images/19x19_3_5.png';
        ratingElement.appendChild(img);

    }


}

function errorCallback(response) {
    var ratingElement = document.getElementById('ratestars');
    var t = document.createTextNode("Error With Yelp AJAX Request");
    ratingElement.appendChild(t);

}

//ViewModel
var ViewModel = function() {



    Model.vm.dropDown.subscribe(function(selection) {



        // This checks if the "Choose City" element is selected in the drop down
        if (Model.vm.citys.indexOf(selection) === -1) {


       Model.vm.markerSelect(Model.vm.citys.indexOf(selection));
            for (var b = 0; b < Model.markers.length; b++) {

              Model.markers[b].setVisible(true);


              //poop here
              //Model.markers[b].infowindow.close();
                Model.markers[b].setIcon('https://maps.google.com/mapfiles/ms/icons/red-dot.png');



            }

            /*for (var b = 0; b < Model.locations.length; b++) {
                Model.vm.array.push(Model.locations[b].title);
            }
*/
        }

        // This checks what city is selected in the drop down
        if (Model.vm.citys.indexOf(selection) > -1) {


            for (var i = 0; i < Model.markers.length; i++) {
                Model.markers[i].setVisible(false);
             //console.log(Model.vm.citys().indexOf(selection));
            }

            //Model.vm.array.removeAll();

            //Model.vm.array.push(Model.locations[Model.vm.citys.indexOf(selection)].title);
            Model.markers[Model.vm.citys.indexOf(selection)].setVisible(true);
            //populateInfoWindow(Model.markers[Model.vm.citys.indexOf(selection)], InfoWindow);

              Model.vm.markerSelect(Model.vm.citys.indexOf(selection));
            //  console.log(Model.vm.markerSelect());
            //console.log(Model.vm.citys.indexOf(selection));
              Model.markers[Model.vm.citys.indexOf(selection)].setIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png');

              ;



        }



    });
};



function openNav() {
    document.getElementById("mySidenav").style.width = "250px";


}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";



}
