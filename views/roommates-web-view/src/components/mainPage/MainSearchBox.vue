// --= TEMPLATE =-- //
<template>
<div class="r-main-search">

  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-8 offset-md-2 col-md-6 r-main-search-box">
        <input class="form-control form-control-lg" 
          type="search" 
          placeholder="Find your next roommates now!">
      </div>

      <div class="col-sm-4 col-md-4">
        <div class="xxs-text-align">
          <button type="button" class="btn btn-warning r-btn-search">
            <i class="ion-android-search"></i>
          </button>

          <button type="button"
            class="btn btn-light r-btn-filter"
            data-toggle="collapse" 
            href="#collapse-filter"
            aria-expanded="false"
            aria-controls="collapse-filter">
              <i class="ion-android-funnel"></i>
          </button>
        </div>  
      </div>
    </div>

    <div class="row">
      <div class="offset-md-2 col-md-6 col-sm-10">
        <div class="collapse multi-collapse r-main-search-filter-extend" id="collapse-filter">
          <div class="card card-body">
            filters here
          </div>
        </div>
      </div>
    </div>
    
  </div>

</div>
</template>

// --= SCRIPT =-- //
<script>
export default {
  
}
</script>

// --= STYLE =-- //
<style>
  .r-main-search {
    padding-bottom: 10%;
    padding-top: 10%;
  }

  .r-main-search-box,
  .r-btn-search,
  .r-btn-filter {
    margin-bottom: 15px;
  }

  .r-btn-search {
    padding: 10px 40px;
    margin-right: 9px;
  }

  .r-btn-filter {
     padding: 10px 15px;
  }

  .r-main-search-filter-extend {
    margin-top: 10px;
  }
</style>
