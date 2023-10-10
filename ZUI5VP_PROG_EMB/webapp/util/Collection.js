sap.ui.define([
    "sap/ui/base/Object"
], function (Object) {
    "use strict";

    var collectionService = {};

    collectionService = {
        arrayToPaginatedHashMap : function (collection, propertyKeyName) {
            var map = {};

            collection.forEach(function (element) {

                var key = element[propertyKeyName];

                if (!map[key]) {
                    map[key] = [];
                }

                map[key].push(element);
            
            });

            var sortedHashMap = this.sortHashMap(map);
            var paginatedHashMap = this.paginateHashMap(sortedHashMap);
            
            return paginatedHashMap;

        },
        sortHashMap: function(map){

            var array = [];
            for (var key in map) {
              array.push({
                key: key,
                value: map[key]
              });
            }
            
            var sorted = array.sort(function(a, b) {
              return (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0)
            });

            return sorted;
        },
        paginateHashMap: function(map){

            for (var index = 0; index < map.length; index++) {

                if (map[index+1]){
                    map[index].next = map[index+1]; 
                }

                if(map[index-1]){
                    map[index].previous = map[index-1];
                }
                
                if(index === 0){
                    map.first = map[index];
                }

                map.last = map[index];
            }

            return map;
        }
    };

    return collectionService;

});