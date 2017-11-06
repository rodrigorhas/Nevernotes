function FilterByTags () {
  return function (items, output) {
    
    if(!output) return items;
    
    var isValidSearch = function () {
      if($.isPlainObject(output)) {
        if(output.signs.length >= output.values.length && output.values.length) {
          var remainder = output.signs.length - output.values.length + 1;
          if(remainder) {
            return false;
          }
          
          else true;
        }
      }
    }
    
    var exists = function (item, array) {
      var e = false;
      for (var i = 0; i < array.length; i++) {
        var ai = array[i];
        if (ai.name == item) {
          e = true;
          break;
        }
      }
      
      return e;
    }
    
    var simpleSearch = function (array, item) {
      var res = false;
      for (var i = 0; i < array.values.length; i++) {
        if(exists(array.values[i].value, item.tags)) {
          res =  true;
          break;
        }
      }
      
      return res;
    }
    
    if(isValidSearch() == false) return false;
    
    // fix additional non-used signs
    
    if($.isPlainObject(output)) {
      return items.filter(function (item) {
        var match = true;
        
        if(output.values.length > 1) {
          var values = output.values.chunk(2),
          signMatchResult = [];
          
          if(output.signs.length) {
            output.signs.forEach(function (sign, index) {
              var isEven = (index % 2) == 0,
              value1 = (isEven) ? values[index][0] : values[index-1][1],
              value2 = (isEven) ? values[index][1] : values[index][0];
              
              switch (sign.value) {
                case "&":
                var signMatch = [false, false];
                
                if(!value1.exclude) {
                  if(exists(value1.value, item.tags)) signMatch[0] = true;
                }
                
                else if(!exists(value1.value, item.tags)) signMatch[0] = true;
                
                if(!value2.exclude) {
                  if(exists(value2.value, item.tags)) signMatch[1] = true;
                }
                
                else if(!exists(value2.value, item.tags)) signMatch[1] = true;
                
                signMatchResult.push(signMatch);
                break;
                
                case "|":
                var signMatch = [false];
                
                if(!value1.exclude)
                if(exists(value1.value, item.tags)) signMatch[0] = true;
                
                if(!value2.exclude)
                if(exists(value2.value, item.tags)) signMatch[0] = true;
                
                signMatchResult.push(signMatch);
                break;
              }
              
            });
          }
          
          else 
          match = simpleSearch(output, item);
          
          signMatchResult.forEach(function (result) {
            result.forEach(function (result2) {
              if(result2 == false) return match = false;
            });
          });
          
          return match;
        }
        
        else if(output.values.length == 1) 
        match = simpleSearch(output, item);
        
        else if(output.words) 
        return (item.text.indexOf(output.words) > -1) ? true : false;
        
        return match
      });
    }
  }
}

export default FilterByTags