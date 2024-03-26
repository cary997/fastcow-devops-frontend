export function getTagHook(routeObj) {
  return {
    key: routeObj.name,
    show: routeObj.meta?.showLink === false ? false : true,
    menu_type: routeObj.meta?.menu_type,
    tab: routeObj.meta?.title,
    en_tab: routeObj.meta?.en_title,
    hiddenTag: routeObj.meta?.hiddenTag === true ? true : false,
    checked: false,
  };
}
