<template>
    <div class="grid">
        <div id="search">
            <button type="button" class="btn btn-default btn-sm">
                <i class="fa fa-filter" aria-hidden="true"></i>
            </button>
            <input type="text" id="search-box" placeholder="Enter Location..."/>
            <button type="button" class="btn btn-default btn-sm">
                <i class="fa fa-search" aria-hidden="true"></i>
            </button>
        </div>

        <div id="search-results">
            <ul>
                <li>
                    <div class="apartment-details">
                        <h3 class="apartment-address">
                            <router-link :to="{ name: 'apartment-page', params: { id: 1 } }">Somewhere over the Rainbow</router-link>
                        </h3>
                        <p class="apartment-description">
                            Lorem ipsum dolor sit amet, habemus vivendo mei te, et eam ullum gloriatur.
                            Vix quidam possim temporibus ne. Ex nam albucius vituperatoribus. Ad probo
                            putant assentior mea, eos ei ferri volutpat gloriatur. No vix appetere
                            legendos, ne per omnes offendit.
                        </p>

                        <div class="apartment-price">
                            1200 <span class="currency">₪</span>
                        </div>
                    </div>

                    <div class="apartment-img-container">
                        <div id="carousel-1" class="carousel slide" data-ride="carousel">
                            <ul class="carousel-indicators">
                                <li data-target="#carousel-1" data-slide-to="0" class="active"></li>
                                <li data-target="#carousel-1" data-slide-to="1"></li>
                                <li data-target="#carousel-1" data-slide-to="2"></li>
                            </ul>

                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <img src="static/images/Apartment-01.jpg" alt=""/>
                                </div>
                                <div class="carousel-item">
                                    <img src="static/images/Apartment-02.jpg" alt=""/>
                                </div>
                                <div class="carousel-item">
                                    <img src="static/images/Apartment-01.jpg" alt=""/>
                                </div>
                            </div>

                            <a class="carousel-control-prev" href="#carousel-1" data-slide="prev">
                                <span class="carousel-control-prev-icon"></span>
                            </a>
                            <a class="carousel-control-next" href="#carousel-1" data-slide="next">
                                <span class="carousel-control-next-icon"></span>
                            </a>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="apartment-details">
                        <h3 class="apartment-address">
                            <router-link :to="{ name: 'apartment-page', params: { id: 2 } }">Somewhere in Nesher</router-link>
                        </h3>
                        <p class="apartment-description">
                            Lorem ipsum dolor sit amet, habemus vivendo mei te, et eam ullum gloriatur.
                            Vix quidam possim temporibus ne. Ex nam albucius vituperatoribus. Ad probo
                            putant assentior mea, eos ei ferri volutpat gloriatur. No vix appetere
                            legendos, ne per omnes offendit.
                        </p>

                        <div class="apartment-price">
                            1300 <span class="currency">₪</span>
                        </div>
                    </div>

                    <div class="apartment-img-container">
                        <div id="carousel-2" class="carousel slide" data-ride="carousel">
                            <ul class="carousel-indicators">
                                <li data-target="#carousel-2" data-slide-to="0" class="active"></li>
                                <li data-target="#carousel-2" data-slide-to="1"></li>
                                <li data-target="#carousel-2" data-slide-to="2"></li>
                            </ul>

                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <img src="static/images/Apartment-02.jpg" alt=""/>
                                </div>
                                <div class="carousel-item">
                                    <img src="static/images/Apartment-01.jpg" alt=""/>
                                </div>
                                <div class="carousel-item">
                                    <img src="static/images/Apartment-02.jpg" alt=""/>
                                </div>
                            </div>

                            <a class="carousel-control-prev" href="#carousel-2" data-slide="prev">
                                <span class="carousel-control-prev-icon"></span>
                            </a>
                            <a class="carousel-control-next" href="#carousel-2" data-slide="next">
                                <span class="carousel-control-next-icon"></span>
                            </a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <div id="search-results-pagination">
            <ul class="pagination">
                <li class="page-item"><a class="page-link" href="#">Prev</a></li>
                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item"><a class="page-link" href="#">Next</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "main-page"
    }
</script>

<style scoped>
    #search {
        width: 360px;
        margin: 0 auto;
        font-size: 0;
    }

    #search-box {
        width: 300px;
        padding: 4px 5px;
        border: solid 1px #c72d2d;
        border-right-width: 0;
        font-size: 16px;
    }

    #search button {
        display: inline-block;
        background: #c72d2d;
        margin: -14px 0 0;
        color: #fff;
        border-radius: 0;
        width: 30px;
        height: 34px;
        border: none;
        outline: none;
    }

    #search button:last-child {
        background: #fff;
        color: #c72d2d;
        border: solid 1px #c72d2d;
        border-left-width: 0;
    }

    #search-results {
        margin-top: 50px;
    }

    #search-results > ul {
        margin: 0;
        padding: 0;
    }

    #search-results > ul > li {
        margin: 0;
        padding: 0;
        display: flex;
        border: solid 1px #c72d2d;
        height: 162px;
        color: #505050;
    }

    #search-results > ul > li {
        box-shadow: #c72d2d 0px 0px 1px;
        margin-top: 10px;
    }

    #search-results li .apartment-details {
        flex: 1;
        padding: 10px;
        position: relative;
    }

    #search-results li .apartment-details h3 {
        margin: 0 0 5px;
        font-weight: bold;
    }

    #search-results li .apartment-details h3 a {
        color: #505050;
    }

    #search-results li .apartment-price {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 0 5px 4px 10px;
        color: #fff;
        background-color: #c72d2d;
        font-size: 20px;
        line-height: 1.2;
    }

    #search-results li .apartment-price .currency {
        font-size: 25px;
        margin-right: 5px;
        margin-top: -4px;
    }

    #search-results li .apartment-img-container {
        width: 260px;
        height: 160px;
        overflow: hidden;
        display: inline-block;
    }

    #search-results li .carousel {
        width: 260px;
        height: 160px;
    }

    #search-results li img {
        -webkit-transition: all 0.2s ease;
        -moz-transition: all 0.2s ease;
        -ms-transition: all 0.2s ease;
        -o-transition: all 0.2s ease;
        transition: all 0.2s ease;

        -webkit-transform: scale(1);
        -moz-transform: scale(1);
        -ms-transform: scale(1);
        -o-transform: scale(1);
        transform: scale(1);

        width: 260px;
        height: 160px;
        object-fit: cover;
    }

    #search-results li img:hover {
        -webkit-transform: scale(1.08);
        -moz-transform: scale(1.08);
        -ms-transform: scale(1.08);
        -o-transform: scale(1.08);
        transform: scale(1.08);
    }

    #search-results-pagination {
        margin-top: 20px;
        text-align: center;
    }

    #search-results-pagination .pagination {
        display: inline-flex;
    }

    #search-results-pagination a {
        color: #c72d2d;
    }

    #search-results-pagination .active a {
        background-color: #c72d2d;
        color: #fff;
        border: 1px solid #ddd;
    }
</style>