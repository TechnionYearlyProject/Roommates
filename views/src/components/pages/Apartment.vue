<template>
    <div class="apartPage grid">
        <div class="container">
            <div class="row">
                <div class="col-sm">
                    <div>


                        <b-carousel id="carousel1" style="text-shadow: 1px 1px 2px #333;"
                                    controls
                                    indicators
                                    background="#ababab"
                                    :interval="4000"
                                    img-width="1024"
                                    img-height="480"
                                    @sliding-start="onSlideStart"
                                    @sliding-end="onSlideEnd"
                                    v-model="apartment.images">
                        </b-carousel>

                    </div>
                    <p><br></p>
                    <div class="single-property-header">
                        <h1>{{apartment.location.address.city}}, {{apartment.location.address.street}},
                            {{apartment.location.address.houseNumber}}/{{apartment.location.address.entranceNumber}}</h1>
                    </div>

                    <div class="row">
                        <div class="col-sm">
                            <h2>{{apartment.price}} per month</h2>
                        </div>
                        <div class="col-sm">
                            <p>{{apartment.price}} utilty bi-monthly</p>
                        </div>
                    </div>

                    <div>
                        <div class="row">
                            <div class="col-sm">
                                    <span class="property-info icon-area">
                                        <img src="https://technext.github.io/garo-estate/assets/img/icon/room-orange.png">
                                    </span>
                                <span class="property-info-entry">
                                        <span class="property-info-label"><br>Area<br></span>
                                        <span class="property-info-value">{{apartment.area}}<br><b><small> Sq meters</small></b></span>
                                    </span>
                            </div>
                            <div class="col-sm">
                                <div class="col-xs-6 col-sm-3 col-md-3 p-b-15">
                                    <span class="property-info icon-area">
                                        <img src="data:image/png;base64,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"
                                             style="width:30px;height:30px">
                                    </span>
                                    <span class="property-info-entry">
                                        <span class="property-info-label"><br>toilets<br></span>
                                        <span class="property-info-value">{{apartment.toilets}}<br><b><small></small></b></span>
                                    </span>
                                </div>
                            </div>
                            <div class="col-sm">
                                <div class="col-xs-6 col-sm-3 col-md-3 p-b-15">
                                    <span class="property-info-icon icon-garage">
                                        <img src="https://technext.github.io/garo-estate/assets/img/icon/room-orange.png">
                                    </span>
                                    <span class="property-info-entry">
                                        <span class="property-info-label">Garages</span>
                                        <span class="property-info-value">2</span>
                                    </span>
                                </div>
                            </div>

                        </div>
                        <div class="row">
                            <div class="col-sm">
                                <div class="col-xs-6 col-sm-3 col-md-3 p-b-15">
                                    <span class="property-info-icon icon-bed">
                                        <img src="https://technext.github.io/garo-estate/assets/img/icon/bed-orange.png">
                                    </span>
                                    <span class="property-info-entry">
                                        <span class="property-info-label">Bedrooms</span>
                                        <span class="property-info-value">3</span>
                                    </span>
                                </div>
                            </div>
                            <div class="col-sm">
                                <div class="col-xs-6 col-sm-3 col-md-3 p-b-15">
                                    <span class="property-info-icon icon-bed">
                                        <img src="https://technext.github.io/garo-estate/assets/img/icon/cars-orange.png">
                                    </span>
                                    <span class="property-info-entry">
                                        <span class="property-info-label">Car garages</span>
                                        <span class="property-info-value">1</span>
                                    </span>
                                </div>
                            </div>
                            <div class="col-sm">
                                <div class="col-xs-6 col-sm-3 col-md-3 p-b-15">
                                    <span class="property-info-icon icon-bath">
                                        <img src="https://technext.github.io/garo-estate/assets/img/icon/os-orange.png">
                                    </span>
                                    <span class="property-info-entry">
                                        <span class="property-info-label">Bathrooms</span>
                                        <span class="property-info-value">{{apartment.numberO}}</span>
                                    </span>
                                </div>
                            </div>

                        </div>
                        <div class="row">
                            <div class="col-sm">
                                <div class="col-xs-6 col-sm-3 col-md-3 p-b-15">
                                    <span class="property-info-icon icon-garage">
                                        <img src="https://technext.github.io/garo-estate/assets/img/icon/shawer-orange.png">
                                    </span>
                                    <span class="property-info-entry">
                                        <span class="property-info-label">showers</span>
                                        <span class="property-info-value">{{apartment.showers}}</span>
                                    </span>
                                </div>
                            </div>
                            <div class="col-sm">
                                <div class="col-xs-6 col-sm-3 col-md-3 p-b-15">
                                    <span class="property-info-icon icon-garage">
                                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAAELCAMAAAC77XfeAAAAkFBMVEX///+yIiKuAACyICCxHR2vDAzYnZ2xFhb89PS5PT2xHBysAACwExP36OiwFxfjv7/Me3uvCQnu1NS3MDD04+Pfr6/IcHD9+fn57u63NDTHa2vao6O7RES9U1Pdqqrox8fSjIzw2tq0KSnit7fTj4/BW1vPg4PCXl7LeHjrzc29S0u6QkLFZWXYnp7UlZXQjIwUjdNQAAALXElEQVR4nO2da3eqOhCGSwJeEFG8227v1lptPf//3x2UQBJIIoGh4Fp5vu3WbV/jJJnMZIa3N4PBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAk9D/xpG4NhRl57eBUt4iibJBt+Z91qyjIFGHLcld1yyjGx1285b7m2EfiLf+rbiFFaEXiX1P9jYh/Scu5Ict6WfWtRPwLrjkfsdmE2P/qVqPJlBFv2eN53Xq0OLDiLex36hakw4ATb1noldR/p8RbaFe3pPxMnJR4Cw3q1pSbhW2nxFvBum5ReZkv/bR4yxvWrSovFy8j/nW2qx8nK97C1mss+EMkEB9O25c42X6IxVvoULeyHKR3KTptX+BcvpOJt9zm+2mChT6ZtmhRt7pnXLIL/esY/rtorYzx3+uWp6YlWW6I6fiNXvE30hlLTKfJjlrfU4u32rO6JSq4KmZsZDpOc08oM9WMJabTWC9Z5iCwNHbDGj2ZsWTwR3XrFNKxpHssS0Pn7ZfgPCIAo37dSgWotykGb1u31Cz5jP4x+E7jXLV5PqN/4PxXt9o0P/mMvpmDv85r9NHgN+uINclt9NHgN2vZ6bo64sNlp0lr/inQEx8OfnM23Eys+DkN8nbG+RfLhMa4mqfnbnEW7DVj1SxgN3e8c93C78z3BezmPvjou27pIcMidnPHXtYt/R5DKCjesoJt3eLfCtrNnfoX/W1Ru7njdusVL48W56Jm2/mn6d+kqNd29PxiAc9tZ3T76i7Hy+5PCzpT3XkW9nuO+pLj4rRHjm/b2LZ9B42PoNvzWeM8JQGjjfTt59sel223HecGJz7/OVyBvZeFxDdWkH5/3BuD2c+13JQlOBJ/54ZEO4kLlXyZlp2yBHFE/yj5YjH6gBA/bwPYzUOPK4iJy0NbGE0B1Bfy6oV4P5k3ZzMw2PU932X+DXDLRzOKoCQzmh03sXnsoMv7cPbp0Gngjkur/2mDiQ/PWakACf1efa8VLfKd6T75YWnTHwFN2Yg2f820n3yvwYrZoM7x3yydeLyArJYJ/Bn9GI9ywId9kqlc8khf4kwiBAes7ezJ0PuX1J+dkc3dvZZSrxs7e4rP3JqKrRIH6ds8cxx9rnKRxAHw0Ieg3+TdW8RwBFGHX/KrUjvusvhxUAazir+TnK/A+V+QYSvjrh3gh561ZbIiCC+xdaNxK3NZows/9CHoxr+9LTq5zKLvpUQYlLF6uP2WsZ2lQv0w2iTt4tstPcxiDCnfveRQ75VU/02H3rvNnt2q0IFsQpWq/6SC0eJU/nBIIffzefWj9TRiDqF+x9WRnAGdtfieMq/+1gvuoOjufln1M6o3WL/9QFoOmbi8erJ34TaE+gXj16PF2yesy/BwGCpU36JHqnv5FLD6xyG3QvXMGnmvBfgEtZwoqF+detY/64WO3hew+vuqqVJ/Dtw77X0h9cxYP3brd2j19n6uUn+8rB4UqvnrM3P24efBrph3go9/CvWlYOZsVH60hdytIpn7Ja5IPZPnwe79BzewqA59Y/L1gqtnIwntx8nnQ/eGQn7A1bNeTXQ4q+SgUpF6NtvQe0RaYOM6lapn4yDkvSEDghWrHzKGQ+pfwCLJ1av3GaVx1L2C8IJK/ejn/cGXdkCHs/EeGYoZ+HalVD/o+Q962mVnRyfz1lUumWL1ZAT1i+ZYI0nKvqpbdGDVs+cSGoqbl8/Z/ol6bmOidgfuI1ejnl0vsZf8GCp1WLF6NnDG9DPpVLVfSdQ/TieurnrO7L0j/cV7RWumUP339fLgqrneczF7NkNc1aoDuteyqz3fGAE4h1WJejb2gRH7G5DbFhWrZ9f1VIBU+xL1n6vvs9adLjpaVmE7kOq/WfXOkf9lyct11aufstaRSdnlrlaqST2/5GSuEOsUzdSgngua9TJ7xXwMbvri08ls+GCmd8GOu8aFsr+fZC6RVaJ+0PMeZMdPCZtfiwJRKaQdIGDVRxNMN9XPda8SXnLIU1xbk3rOk5R0zBvCblqA6jkPU1Yhq2oD0Rz1shZECwwZHqlMvezyMKi/9ufqQffcv1f/toIz/arWHIV6QH+tqvVe1YEILjJYlfq2okwN7pQLqZ71FHxVdSxYUBlSPVsfo2zaNoTylSHVs/aszLOvofwFSPVsahMLPOQEsGuykOr5GKzi/06aqH7HhdLkhTpvi0xXzAaon7NLptNSqPcbqJ67Qupnay0arv4/NnwfKNRDJVNA1XNriaKqupGzljd8RYvUP1oxdUsOV1wQWVr58QF150WZ+WnrdpjlVvxAWnYDds9Oqd4KVnqVM5zpYCx5FdikfaLe8sZ6xsO57s5W/KJfsLDIE/WWb2nJ5113cVH1HOxKPkYXgfpNj84+X6+lO1dFbruij16qxp/FRSRHkIohf3dpwNTTaq/Ml/q4AsMDC2Y6yzivl4mAb+nfQFsd+XyZlYvTxZYFG6JkQfTsmY3ff/uxDNzT6QmQ2olsxBcOrcHEM+8ryD4sxvGqrNeLJBWuwcF+ncyc0QVMPJsWE+VOOvt49JHC282QuURnB8777+B7czhdEVT2JOD2UWHmJ9GBtR5nkA31Yd9BIR5YANbna6li9fwzIzY98up0+lLNv6qu48SkS4XF6pMCYoXHJaDfq+wKYwRfuDz6ij0Pt/vB6pzb5Od6RfLPWgaXhIu2dGY9elKzkcsep+NbTZq1tlVklinsUO4sPrKFud0pju5pXjSSdOYHATMlGbtsNwvELEdxLYDuozC+4C/dxzB9S/ttwTLG7GN9suyoQgRCVpXJZzzXlSiWzraCIE4jdjTVv31VdAOWqQiW3Ox3aaX8kcwK/Xuxs2psn3lmoKxDDI3jxV5XgbZxsh4r5aD14rue5CXUzOPYS1CgLcoBzK9hoEKk5TjMRVbyAQuVyE+W8HOX3pSUXxCm85Zsw16xFr9nYXuhAuB4V6JGLU8g0U9I+nIWfXrQBoOEu8MzbLx8JMrkFet0dyKfUJUEVDIflrd+7Ix3c2LC9MLbXq4+ceNIS6ASj4AJT1TlzMdFJ5rMpuN6lVtO8gnJf/K0XPwUg2UJ/Rh177trHAaiwygvHk1mbewqyKOSuZjuC+rHASaDTe4y01yqtJ6FrpjJbqXIQ+ViPUb6KRMc+K3YMSBRRtq/ayLbrejVpuKeQobNJ9KKv2IX4RY9LMVDTXd9WSyaviLulqLKv+ZmsnVzfwH3Tlzc/h7HSKnhj8SDT/sZxWYP9ri1wbuDPPvJJ8Cug/bH1LeddCXCyfchfPoIpmYS+xIlJy1LZ3MaI/knwLaH0PUmiN/F4XXa0Gq+F9gOc2b3i50Mn9E/DJdthBzPtXGC7XoOQu3u6SDOl8ULiE2PhgsrLR8zR6t4ppTsgCWkszv8nj67e9f3PK8dborL1el3MFHEXuKi74AKXFx5N9xlRj65rAXSNlDGvLNYdPIEjG5BxrLvp4hkIQsXqS5jce9e/PJGPHKqEzt8nClMTjYKwq/PQcGKvfR/SCKB2z/WKeEY764B7zPu1sfhqbXhUh27YlHYCqEpr6cpkX4S84Xp9QkBTSwhtc+7S5IndXezZqHlH+hHMRcHiU8I0egTDKapp7eU6trSKLZW5qRymFvYdm8oTCYP9tR1dnRjgBVzYLIDHjplejRO2ZOQl25AWTsfjHzs9f4x3b8XhxliT0FetxH7FMeay82E7ii6zs7D8/nT7SGu84RzaZ74R/WyxYJtv+212y7vtWLUMJuPyROjS+e5G8R89iRIhINx3U+MUPHdVQQpsKd3uaIGpnvkCs9n4Yn43KiHY4kZrFCQnqrhsNu3Zjwf6CmT3wsKnfu2a4e47XDxtE5lA09/Sme0Ps7+jZfL5eX8u3kBizEYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDIay/A96xbrFV3rGNwAAAABJRU5ErkJggg=="
                                             style="width:30px;height:30px">
                                    </span>
                                    <span class="property-info-entry">
                                        <span class="property-info-label">hot_water</span>
                                        <span class="property-info-value"><img src="waterHeaterMethod" alt=""></span>
                                    </span>
                                </div>
                            </div>
                            <div class="col-sm">
                                <div class="col-xs-6 col-sm-3 col-md-3 p-b-15">
                                    <span class="property-info-icon icon-garage">
                                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAMAAAAPdrEwAAAAY1BMVEX///8AAAD4+Pjw8PCPj4+/v78QEBCnp6eampp9fX3g4OB2dnY2NjZhYWEfHx+KioomJiZGRkZQUFChoaHNzc3o6OjW1tbHx8doaGhtbW25ubkXFxevr69cXFyDg4NBQUEtLS3NngzLAAAC8UlEQVRYhe2ZDbOqIBCGXU1T85jmV6lp//9XHhRIVMwFunPv3PGdOePWxhNngWUhy/pbyttyy+WeXRNyCgA/Uk/REFfjaJPvMOghc/Wj66ZL7oDqtHYVzBXqkVvgqle+kHk2R+Kjcpi0IhihC4EM3nK8TNB2LKLhtYHWifUN5lpMQQP0BZbqvoTOVmSA9itoV0IGqL6ADqVkgMIY7XisXcCMgL2ObeK1TdBX1uzBp7bzw4zMKp5xmi/Q1e31QOaplLbq3+0d68W6b3Med5EYVcOzsVHoCwdO7Vn/MzpzEltwOdSQpDCJKKecdW1MKDH/1qfwD0XUuOMiUt4gGmZaKQTUjeDuWGf2js+HweZry8eh+TQQ0ez9iA8ofcQ+e53gYj31foXmkV2p2KZg0bMsPilXJEvRwt4zqd0i7KLn+b5bka/K5A209VyQ5dXEZ+VytJXMyJHi5Jihl4M02zZBq8zZQn/e7M3Q71UJoFn3SScfFZ8m6PW9FC0YepmL7vgXXTLtdiJdxPaQ1Z/aZAJo/c1gVpny8v7zsh2sFLl+1HhINdFJYT3KS5wPQs/uSpU8r6w+RUOdTDZJFPq8D1rrjEIvS2uUIhS60UEDCs2LyMrF6MTQqGB7KtF7T9QDbY6u6qmRKyxobuujh0nOcxsp4D1GGE6siRl6rKNZWT7uwhm1xxXbGqHHLYydRivha/z3J/QDMpxiCsHBguO8aQbD6ArDWM9s5tdDn4PLJQiCLiD7iM9tUnqcBFsPLZTSDyHT+kIZ7Gui/QkRC/ZVyLqdOTo50Af6P0d3X0CX6XBCJH9NWucpSf4eKVHitHL74Uk+lqS5duYjfY0zdp69khLphx1fApK4U5rIDdHPA32gD/Q/jg7M0TyH9Pfv9bpIoA7ZDVHogVuxuyZSZZY1NKEmml45khY2b2Xze1zRrjTQikKhk33OWh6GbAX7oLVwt5/lPmgt5I3IQ52M/iW2VyUn+Auo6z5NlNJNouP6J6T8eqPLv5CIMUQ8Bv7PAAAAAElFTkSuQmCC"
                                             style="width:30px;height:30px">
                                    </span>
                                    <span class="property-info-entry">
                                        <span class="property-info-label">elevator</span>
                                        <span class="property-info-value">{{apartment.elevator}}</span>
                                    </span>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div class="section">
                        <h4 class="s-property-title">Description</h4>
                        <div class="s-property-content">
                            <p>{{apartment.description}}</p>
                        </div>
                    </div>
                </div>
                <div class="col-sm">


                    <div class="card" style="width: 20rem;">
                        <div class="card-body">
                            <b-container>
                                <b-row>
                                    <b-col cols="2">
                                        <img class="card-img-top rounded-circle"
                                             src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRzrsvYREQF2spJT1b4hc_SQmbnGEtPDGeoYlcdZDTf0FIpnNzHg"
                                             alt="Card image cap" style="width:128px;height:128px">
                                    </b-col>
                                    <b-col cols="3">
                                        <h4>{{auther.firstName}} {{auther.lastName}}</h4>
                                        <img src="data:image/png;base64,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"
                                             style="width:20px;height:auto"> {{auther.contactInfo.cellNumber}} <br>
                                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPQAAADPCAMAAAD1TAyiAAAAb1BMVEX///8AAABvb29cXFxUVFRsbGySkpIwMDD4+Pjr6+uBgYHv7+9+fn719fViYmJ4eHjk5OSHh4eenp7IyMgcHBzb29siIiINDQ2rq6u7u7tnZ2fS0tLBwcEUFBQ2NjYnJyeamppJSUk9PT2np6dHR0cL2y+QAAAEfUlEQVR4nO3da1viMBCG4XAQK1AQz+IJ1P//G1fQVWZyaEKTzLj7Ph8F295XSgtpRWMQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEELon2syHqlrfFcYvR4obFIYfSINdAU00EADDTTQQHvQw+WwbsuxPHpUeI1WZ0/y6MG48CpZ5xp278pqh1nmQFZR7TILHb2rqc+cqxc6ZVVSO8dZ7jxdRe0xV0SP6OmywpnLvW9XRS/Ma101M09+Vl9xpE1dNTOvzKkMmqkXJVdsmcXQ5plsybrcepl5agTRTF1srB1mQXRTZaxdZkG0aU7J9pyUWKnTLIk2zQvZomH+dbrNomg+1tnVM7dZFs3Hepl3jbNbsvT59wOyaNPclFP7xlkcbVqqnnt/PTlmPlyyNNq0dN5q6vv11Lz7tlGANi3dukzqkFkBushYB80a0HwLV/3XFTarQPNjTm/1jO471tFRBTqzmo2zfR7UgbbmNvqsqO0YZzVoPtY9NoaZXe93tKCzjXXbtW8bRehM6ohx1oTOom6vIsya0BnUUeOsC82vQ2xSVxFp1oXuqY7bt402dC91tFkbmqsv4pcfu28bfWhzfaS6TZiDUYc+Us3M4TlGfWiufotZeENfzx3zqgrRXB1x933SOOtEJ6ubNLNOtHlIUqft20YrOkmdfnVIKZqr7/3PZOaY64Ba0dHq1NfzLrVo8x6lZuN8FbVotejtgOVUM3PkHQ1a0dad2U4127d3xdzRoBQ9ss2DwSN/ljXOu37t0dtpttTsmn68WiV64TYztXOcd3Ve5daIDvyJy4HaM867uq5yK0QPCYDeePWjZndk0TqufOpDM7N5pJ6vzbyk8yRrdhwPXw1Th14yszH3bBhH09WcnarW1gxZUKMNPSeb/tLsfsbVVvtzM7ueE+IoQ0/Jht80nz/tUH+9C2NXaDf+tehCr6i5/fvzoPr7PRhT+2fXVKGp+an9eSSgPni3za4LeWfXNKEnZJNv28PH7iLM1qy5b+5BEZqZZ/RRz1iz95xxaj3oC7q9M/44m1X4zHrdRqnVoJn5zH5GQ0/hHz1f289iM6nOT+Fa0G+d5o/OyRltcel8UoRaCZodp869S3nYLLevz+/DzWXrewpTW5/CtaCjzVGxV7+tVoFmR2bHKzUtprZeBhrQuc2dagXo/OaPT550mQ/0UXn0Y3D7ji2oFkeXMYeXK40O74d9CrxqhNFdx9k+MfXBeVAWXdIcOPuLojvfRfTMp5ZEx3w26JfnHb0gurzZp5ZD1zB7PrGKoSNndnq3oevZz01IoWuZnWohNDNH3RV4bHTu7aqVQrO52oR7fY+JzaY3IuhFW9VsqQ++eKMeekuvpm8Kr9jwq0XvEiNNK73efdZEqiy6iplf9RZGZ/i74bjcahF0tm8D6M75peoS6Izf+9Cd654lAXRVs1NdH11x3/7M3sMFvhZ3XDsFaAUBDTTQQAMNNND7/sv/onRxUvl/MUS0LjTbjhBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQpL9AYUZSAL+6WzgAAAAAElFTkSuQmCC"
                                             style="width:30px;height:auto"> {{auther.contactInfo.eMail}}<br>
                                    </b-col>
                                </b-row>
                            </b-container>
                        </div>
                    </div>
                    <div class="card" style="width: 20rem;">
                        <div class="card-header">
                            interested users:
                        </div>
                        <img class="card-img-top" />
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item" v-for="user in calUsers">{{user.firstName}}
                                    {{user.lastName}}
                                    <a href="#" class="btn btn-secondry btn-sm">user info</a>
                                </li>
                                <li class="list-group-item" v-for="p in (5-calUsers.length)">
                                    <br>
                                </li>
                            </ul>
                        </div>


                        <b-pagination align="center" :total-rows="apartment.interstedUsers.length"
                                      v-model="usersPage" :per-page="5">
                        </b-pagination>

                    </div>
                </div>
            </div>

            <div class="card" style="width: 60rem;">
                <div class="card-header">
                    description:
                </div>
                <div class="card-body">
                    <p class="card-text">{{apartment.description}}</p>
                </div>
            </div>

            <div class="card" style="width: 60rem;">
                <div class="card-header">
                    users comment:
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item" v-for="comment in calCom">
                            {{comment.comment}} at: {{comment.writenAt}}
                        </li>
                        <li class="list-group-item" v-for="p in (5-calCom.length)">
                            <br>
                        </li>
                    </ul>
                    <p class="card-text"></p>
                </div>
            </div>


            <b-pagination align="center" :total-rows="apartment.comments.length"
                          v-model="commentPage" :per-page="5">
            </b-pagination>

        </div>
    </div>
</template>

<script>
    import bCarousel from 'bootstrap-vue/es/components/carousel/carousel';
    import bPagination from 'bootstrap-vue/es/components/pagination/pagination';


    export default {
        name: 'apartment-page',
        data() {
            return {
                sliding: null,
                imgNum: 1,
                commentPage: 1,
                usersPage: 1,
                currImg: 1,
                auther: {
                    firstName: 'chanan',
                    lastName: 'ben tal',
                    _id: '1',
                    img: "https://images.pexels.com/photos/428339/pexels-photo-428339.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb",
                    contactInfo: {
                        cellNumber: '054-4204942',
                        eMail: 'chananbental@gmail.com'
                    }
                },
                apartment: {
                    _id: '1',
                    createdBy: '1',
                    location: {
                        address: {
                            state: 'Israel',
                            city: 'chaifa',
                            street: 'shalom alychem',
                            houseNumber: 18,
                            entranceNumber: 1,
                        },
                        geoLocation: [0, 0]
                    },
                    floor: 1,
                    totalFloors: 4,
                    description: "a very nice place",
                    price: 1200,
                    area: 100,
                    numRooms: 4,
                    toilets: 2,
                    showers: 2,
                    roomatesNeeded: 3,
                    roomatesCurrently: 1,
                    electricWaterHeater: true,
                    solarWaterHeater: false,
                    elevator: "yes",
                    images: [
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4qUg397lGFM0dJpE9rA1DHzttbtfQiYXQULgqKRreYTUnQuCq",
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUIzpQEzg9pExt10YWgJU4_6XGoXiD1FeUCkuV7ZEPG8wGi8SXHg",
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPhqE9OKHQApVJLMlRBtg4Bb8fDCNjQIXce3DgJgHpGAJrru2EDg"
                    ],
                    interstedUsers: [
                        {
                            firstName: 'chanan',
                            lastName: 'ben tal',
                            _id: '1'
                        },
                        {
                            firstName: 'hanan',
                            lastName: 'ben-tal',
                            _id: '2'
                        },
                        {
                            firstName: 'khanan',
                            lastName: 'ben tal',
                            _id: '3'
                        },
                        {
                            firstName: 'gabi',
                            lastName: 'ben-tal',
                            _id: '4'
                        },
                        {
                            firstName: 'chseanan',
                            lastName: 'ben tal',
                            _id: '5'
                        },
                        {
                            firstName: 'hangran',
                            lastName: 'ben-tal',
                            _id: '66'
                        },
                        {
                            firstName: 'khadfgnan',
                            lastName: 'ben tal',
                            _id: '7'
                        },
                        {
                            firstName: 'gaby',
                            lastName: 'ben-tal',
                            _id: '8'
                        },
                    ],

                    comments: [
                        {
                            commentBy: '4',
                            writenAt: "2017-01-01",
                            comment: " i had a look around and i realy like the place"
                        },
                        {
                            commentBy: '2', writenAt: "2017-01-01", comment: " i lived here for a year, realy recommend"
                        },
                        {
                            commentBy: '3', writenAt: "2017-01-01", comment: " the landlord is very nice"
                        },
                        {
                            commentBy: '4',
                            writenAt: "2017-01-01",
                            comment: " i had a look around and i realy like the place"
                        },
                        {
                            commentBy: '2', writenAt: "2017-01-01", comment: " i lived here for a year, realy recommend"
                        },
                        {
                            commentBy: '3', writenAt: "2017-01-01", comment: " the landlord is very nice"
                        },
                        {
                            commentBy: '4',
                            writenAt: "2017-01-01",
                            comment: " i had a look around and i realy like the place"
                        },
                        {
                            commentBy: '2', writenAt: "2017-01-01", comment: " i lived here for a year, realy recommend"
                        },
                        {
                            commentBy: '3', writenAt: "2017-01-01", comment: " the landlord is very nice"
                        },
                        {
                            commentBy: '4',
                            writenAt: "2017-01-01",
                            comment: " i had a look around and i realy like the place"
                        },
                        {
                            commentBy: '2', writenAt: "2017-01-01", comment: " i lived here for a year, realy recommend"
                        },
                        {
                            commentBy: '3', writenAt: "2017-01-01", comment: " the landlord is very nice"
                        },
                    ]
                }
            }
        },
        components: {
            bCarousel, bPagination
        },
        methods: {
            changeCommentPage(newPage) {
                this.commentPage = newPage;
            },
            lastCommentPage() {
                this.commentPage = Math.ceil(apartment.comments.length / 5);

                // (Math.ceil((apartment.comments.length)/5));
            },
            incrementComPage() {
                if (commentPage != (Math.ceil(apartment.comments.length / 5))) {
                    this.commentPage++;
                }
            },
            decrementComPage() {
                if (commentPage != 1) {
                    this.commentPage--;
                }
            },
            changeImg(newImg) {
                this.currImg = newImg;
            },
            decrementImg() {
                if (imgNum != 1) {
                    this.commentPage--;
                }
            },
            changeUsersPage(newPage) {
                this.usersPage = newPage;
            },
            onSlideStart(slide) {
                this.sliding = true
            },
            onSlideEnd(slide) {
                this.sliding = false
            },
        },
        computed: {
            calCom() {
                return this.apartment.comments.slice(5 * (this.commentPage) - 4, 5 * (this.commentPage) + 1);
            },
            calUsers() {
                return this.apartment.interstedUsers.slice(5 * (this.usersPage) - 4, 5 * (this.usersPage) + 1);
            },
            waterHeaterMethod() {
                if (this.apartment.electricWaterHeater) {
                    if (this.apartment.solarWaterHeater) {
                        return "pic of sun and elctricty";
                    }
                    return "pic of electricty";
                }
                return "pic of sun";
            },
            calImg() {
                return this.apartment.images[currImg];
            }
        }
    }
</script>

<style scoped>

</style>
