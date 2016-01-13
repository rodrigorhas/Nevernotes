<!DOCTYPE html>
<html ng-app="App" ng-controller="mainController">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta name="theme-color" content="#fafafa">
    <title>MG Consult</title>

    <link rel="stylesheet" href="fonts/Material-Design-Iconic-Font.css">

    <!-- Vendor CSS -->
    <link href="js/sweet-alert/sweet-alert.min.css" rel="stylesheet">

    <link href="http://cdnjs.cloudflare.com/ajax/libs/summernote/0.7.1/summernote.css" rel="stylesheet">

    <!-- CSS -->
    <link href="dist/css/app.min.css" rel="stylesheet">
    <link href="dist/css/style.css" rel="stylesheet">

</head>

<body>
    <header id="header">
        <ul class="header-inner">
            <li id="menu-trigger" data-trigger="#sidebar">
                <div class="line-wrap">
                    <div class="line top"></div>
                    <div class="line center"></div>
                    <div class="line bottom"></div>
                </div>
            </li>
            
            <li class="logo">
                <a href="#/">NeverNotes</small></a>
            </li>

            <li class="pull-right">
                <ul class="top-menu">
                    <li id="toggle-width">
                        <div class="toggle-switch">
                            <input id="tw-switch" type="checkbox" hidden="hidden" />
                            <label for="tw-switch" class="ts-helper"></label>
                        </div>
                    </li>
                    <li id="top-search">
                        <a id="search-button" href=""><icon name="search"></icon></a>
                    </li>
                    <li class="dropdown">
                        <a data-toggle="dropdown" href=""><icon name="more-vert"></icon></a>
                        <ul class="dropdown-menu dm-icon pull-right">

                            <li class="dropdown-header hidden-lg">{{userInfo.name}}</li>

                            <li>
                                <a ng-click="togglefullscreen()" href=""><i class="md md-fullscreen"></i> Tela cheia</a>
                            </li>
                            <li>
                                <a ng-click="clearlocalstorage()" href=""><i class="md md-delete"></i> Limpar Armazenamento Local</a>
                            </li>
                            <li>
                                <a href=""><i class="md md-person"></i> Configurações de Privacidade</a>
                            </li>
                            <li>
                                <a href=""><i class="md md-settings"></i> Outras Configurações</a>
                            </li>
                            <li>
                                <a href="logout.php"><i class="md md-close"></i> Sair</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </header>

    <section id="main">
        <?php include "inc/sidenav.php"; ?>

        <section id="content">
            <div class="container animated fadeIn" ng-view></div>
        </section>
    </section>

    <script src="bower_components/jquery/dist/jquery.min.js"></script>
    <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
    
    <script src="js/nicescroll/jquery.nicescroll.min.js"></script>

    <script src="js/waves/waves.min.js"></script>

    <script src="http://cdnjs.cloudflare.com/ajax/libs/summernote/0.7.1/summernote.js"></script>

    <script src="bower_components/bootstrap-growl/bootstrap-growl.min.js"></script>

    <script src="bower_components/bootstrap/js/modal.js"></script>
    <script src="js/modal/modal.js"></script>

    <script src="js/angular/angular-min.js"></script>
    <script src="js/angular/angular-route.js"></script>

    <script src="js/script.js"></script>
    <script src="app/router.js"></script>
    <script src="app/filter.js"></script>

    <script src="app/services/store.js"></script>

    <!-- <script src="app/controllers/search.js"></script> -->
    <script src="app/controllers/list.js"></script>

    <script src="app/directives/btn-class.js"></script>
    <script src="app/directives/icon.js"></script>
    <script src="app/directives/historyBack.js"></script>

</body>
</html>