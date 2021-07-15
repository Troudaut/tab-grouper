// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");
const tabColors = ["grey", "blue", "red", "yellow", "green", "pink", "purple", "cyan"];


// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  const tabs = await getTabs();
  const tabsToGroup = await Promise.all(tabs.filter(tab => tab.groupId === -1).map(async tab => {
    tab['groupTitle'] = await getUrlGroupTitle(tab.url);
    return tab;
  }));
  console.log(tabsToGroup);
  const groupTabs = groupByKey(tabsToGroup, 'groupTitle');
  console.log(groupTabs);
  let i = 0;
  for (const [title, tab] of Object.entries(groupTabs)) {
    await createGroup(tab, title, tabColors[i++%tabColors.length]);
  }
});

const groupByKey = (list, key) => list.reduce((hash, obj) => ({...hash, [obj[key]]:( hash[obj[key]] || [] ).concat(obj)}), {})

async function getTabs() {
  const queryOptions = { currentWindow: true };
  return chrome.tabs.query(queryOptions);
}

function getGroupTitle(groupId) {
  return chrome.tabGroups.get(groupId)
}

function getUrlGroupTitle(url) {
  return url.split('://')[1].split('/')[0];
}

function getGroupByGroupTitle(title) {
  console.log('title', title);
  return chrome.tabGroups.query({
    title
  })
}

async function createGroup(tabs, title, color) {
  const groupId = await chrome.tabs.group({
    tabIds: tabs.map(tab => tab.id)
  });
  console.log('Create group', groupId);
  await chrome.tabGroups.update(groupId, {
    title,
    color
  })
}
