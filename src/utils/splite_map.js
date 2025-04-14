import axios from 'axios'
import userconfig from '@/utils/userconfig.js'
import { getcookie } from './cookie'
import Basemap from '@arcgis/core/Basemap'
import Map from '@arcgis/core/Map'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import MapView from '@arcgis/core/views/MapView'
import TileLayer from '@arcgis/core/layers/TileLayer'

export function initsplite(container) {
        var baselayer = null;
        if (userconfig.basemap.basetype == "Image") {
            baselayer = new MapImageLayer({
                url: userconfig.basemap.basemapurl
            });
        } else if (userconfig.basemap.basetype == "Tile") {
            baselayer = new TileLayer({
                url: userconfig.basemap.basemapurl
            });
        }
        var basemap = new Basemap({
            baseLayers: [baselayer],
            title: "basemap",
            id: "basemap"
        });
        var map = new Map({
            basemap: basemap,
            //layers: [userconfig.MapMaskLayer]
        });
        var view = new MapView({
            //container: 'map', // 视图的容器
            container: container,
            map: map, // Map的实例放入视图中
            //center: [104.06, 30.67], // 初始显示的地图中心点，经纬度
            zoom: 3 // 当前地图缩放等级
        });
        view.ui._removeComponents(["attribution"]); //去掉logo
        view.ui.components = [];

        if (container == "map_1") {
            userconfig.spliteViewOne = view
            userconfig.spliteViewOne.watch('stationary', function(value) {
                if (userconfig.view_1) {
                    if (value) {
                        userconfig.view.extent = userconfig.spliteViewOne.extent
                        if (userconfig.spliteViewTwo != null) {
                            userconfig.spliteViewTwo.extent = userconfig.spliteViewOne.extent
                        }
                        if (userconfig.spliteViewThree != null) {
                            userconfig.spliteViewThree.extent = userconfig.spliteViewOne.extent
                        }
                        if (userconfig.spliteViewFour != null) {
                            userconfig.spliteViewFour.extent = userconfig.spliteViewOne.extent
                        }
                        if (userconfig.spliteViewFive != null) {
                            userconfig.spliteViewFive.extent = userconfig.spliteViewOne.extent
                        }
                    }
                }
            })
        }
        if (container == "map_2") {
            userconfig.spliteViewTwo = view
            userconfig.spliteViewTwo.watch('stationary', function(value) {
                if (userconfig.view_2) {
                    if (value) {
                        userconfig.view.extent = userconfig.spliteViewTwo.extent
                        if (userconfig.spliteViewOne != null) {
                            userconfig.spliteViewOne.extent = userconfig.spliteViewTwo.extent
                        }
                        if (userconfig.spliteViewThree != null) {
                            userconfig.spliteViewThree.extent = userconfig.spliteViewTwo.extent
                        }
                        if (userconfig.spliteViewFour != null) {
                            userconfig.spliteViewFour.extent = userconfig.spliteViewTwo.extent
                        }
                        if (userconfig.spliteViewFive != null) {
                            userconfig.spliteViewFive.extent = userconfig.spliteViewTwo.extent
                        }
                    }
                }
            })
        }
        if (container == "map_3") {
            userconfig.spliteViewThree = view
            userconfig.spliteViewThree.watch('stationary', function(value) {
                if (userconfig.view_3) {
                    if (value) {
                        userconfig.view.extent = userconfig.spliteViewThree.extent
                        if (userconfig.spliteViewOne != null) {
                            userconfig.spliteViewOne.extent = userconfig.spliteViewThree.extent
                        }
                        if (userconfig.spliteViewTwo != null) {
                            userconfig.spliteViewTwo.extent = userconfig.spliteViewThree.extent
                        }
                        if (userconfig.spliteViewFour != null) {
                            userconfig.spliteViewFour.extent = userconfig.spliteViewThree.extent
                        }
                        if (userconfig.spliteViewFive != null) {
                            userconfig.spliteViewFive.extent = userconfig.spliteViewThree.extent
                        }
                    }
                }
            })
        }
        if (container == "map_4") {
            userconfig.spliteViewFour = view
            userconfig.spliteViewFour.watch('stationary', function(value) {
                if (userconfig.view_4) {
                    if (value) {
                        userconfig.view.extent = userconfig.spliteViewFour.extent
                        if (userconfig.spliteViewOne != null) {
                            userconfig.spliteViewOne.extent = userconfig.spliteViewFour.extent
                        }
                        if (userconfig.spliteViewTwo != null) {
                            userconfig.spliteViewTwo.extent = userconfig.spliteViewFour.extent
                        }
                        if (userconfig.spliteViewThree != null) {
                            userconfig.spliteViewThree.extent = userconfig.spliteViewFour.extent
                        }
                        if (userconfig.spliteViewFour != null) {
                            userconfig.spliteViewFive.extent = userconfig.spliteViewFour.extent
                        }
                    }
                }
            })
        }
        if (container == "map_5") {
            userconfig.spliteViewFive = view
            userconfig.spliteViewFive.watch('stationary', function(value) {
                if (userconfig.view_5) {
                    if (value) {
                        userconfig.view.extent = userconfig.spliteViewFive.extent
                        if (userconfig.spliteViewOne != null) {
                            userconfig.spliteViewOne.extent = userconfig.spliteViewFive.extent
                        }
                        if (userconfig.spliteViewTwo != null) {
                            userconfig.spliteViewTwo.extent = userconfig.spliteViewFive.extent
                        }
                        if (userconfig.spliteViewThree != null) {
                            userconfig.spliteViewThree.extent = userconfig.spliteViewFive.extent
                        }
                        if (userconfig.spliteViewFour != null) {
                            userconfig.spliteViewFour.extent = userconfig.spliteViewFive.extent
                        }
                    }
                }
            })
        }

        userconfig.view.watch('stationary', function(value) {
            console.log(value)
            console.log(userconfig.view.extent)
            console.log(userconfig.view_0)
            if (userconfig.view_0) {
                if (value) {
                    if (userconfig.spliteViewOne != null) {
                        userconfig.spliteViewOne.extent = userconfig.view.extent
                    }
                    if (userconfig.spliteViewTwo != null) {
                        userconfig.spliteViewTwo.extent = userconfig.view.extent
                    }
                    if (userconfig.spliteViewThree != null) {
                        userconfig.spliteViewThree.extent = userconfig.view.extent
                    }
                    if (userconfig.spliteViewFour != null) {
                        userconfig.spliteViewFour.extent = userconfig.view.extent
                    }
                    if (userconfig.spliteViewFive != null) {
                        userconfig.spliteViewFive.extent = userconfig.view.extent
                    }
                }
            }
        })


}
