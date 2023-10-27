
let app = angular.module("App", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "pages/home.html"
        })
        .when("/cadastro", {
            templateUrl: "pages/formulario.html"
        })
        .when("/adote", {
            templateUrl: "pages/adote.html"
        })
        .when("/pet", {
            templateUrl: "pages/selecao_pet.html"
        })
        .when("/faq", {
            templateUrl: "pages/faq.html"
        })

        .otherwise({redirectTo: "/"})
})
