// const queryParams = {
//   dep: undefined,
//   bssid: undefined,
//   coo: undefined,
// };

function getQueryParamsName() {
  return {
    dep: undefined,
    bssid: undefined,
    // coo: undefined,
  };
}

function getOrigin() {
  return new URL(window.location.href).origin;
}
function removeNullAndUndefinedValues(obj) {
  let ret = {};
  for (let k in obj) {
    if (obj[k] != undefined && obj[k] != null) {
      ret[k] = obj[k];
    }
  }
  return ret;
}
function pushNewOptions(key, value) {
  if (key == undefined || key == null) return;
  let params = getQueryParams();
  params[key] = value;
  params = removeNullAndUndefinedValues(params);

  let url = getOrigin() + "?" + new URLSearchParams(params).toString();
  console.log("new url ", url);
  window.history.pushState({}, "", url);
}

function getDepoptions() {
  let ret = [];
  for (let opt of depdrop.options) {
    ret.push(opt.value);
  }
  return ret;
}

function getUnvalidatedQueryParams() {
  let actualparams = new URLSearchParams(window.location.search);
  let ret = {};
  for (let pname in getQueryParamsName()) {
    ret[pname] = actualparams.get(pname);
  }
  return ret;
}

function validateDepartements(dep) {
  if (dep === undefined || dep == null) return undefined;
  if (getDepoptions().includes(dep)) return dep;
}

// function validateCoo(coo) {
//   if (coo === undefined || coo == null) return undefined;
//   let [lat, long] = coo.split(",");
//   lat = new Number(lat);
//   long = new Number(long);
//   if (lat != NaN && lat != undefined && long != NaN && long != undefined)
//     return [lat.valueOf(), long.valueOf()];
//   else return undefined;
// }

function validateQueryParams(params) {
  let ret = getQueryParamsName();
  ret.dep = validateDepartements(params.dep);
  // ret.coo = validateCoo(params.coo);
  ret.bssid = params.bssid;
  return ret;
}

function getQueryParams() {
  return validateQueryParams(getUnvalidatedQueryParams());
}

export { getQueryParams, getOrigin, pushNewOptions };
