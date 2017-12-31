<template>
<div>

  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-9 r-main-search-box">
        <input class="form-control form-control-lg" 
          type="search" 
          placeholder="Find your next roommates now!"
          >
      </div>

      <div class="col-lg-3 pr-0" style="text-align:center;">
          <a href="#" class="btn s-btn-sun s-btn-search">
            <i class="ion-android-search"></i>
          </a>

          <a
            class="btn s-btn-ghost s-btn-filter"
            data-toggle="collapse" 
            href="#collapse-filter"
            aria-expanded="false"
            aria-controls="collapse-filter">
              <i class="ion-android-funnel"></i>
          </a> 
      </div>
    </div>

    <div class="row">
      <div class="offset-md-2 col-md-6 col-sm-10">
        <div class="collapse navbar-collapse r-main-search-filter-extend" id="collapse-filter">
          <div class="card card-body">
            filters here
          </div>
        </div>
      </div>
    </div>
    
  </div>

</div>
</template>

<script>
export default {
  
}
</script>


<style>

  .r-main-search-box {
    margin-bottom: 10px;
  }

  .s-btn-search,
  .s-btn-filter {
    padding: 12px 18px;
    margin-top: -1px
  }

  .s-btn-search {
      margin-right: 5px;
  }
  
  .r-main-search-filter-extend {
    margin-top: 10px;
    color: #f1c40f;
  }
  
.r-main-search-filter-extend .card-body {
    background-color: #333;
    border-radius: 0;
}
</style>
