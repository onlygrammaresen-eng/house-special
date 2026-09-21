(function () {
  const LS_FAV = "hs-favorite-drink";
  const LS_STATION = "hs-station-checks";
  const LS_COST = "hs-batch-costs";

  const OPTIONS = {
    base: [
      { id: "drip", label: "Drip coffee", short: "Latte", iced: false, oz: 10, milkOz: 2, style: "drip" },
      { id: "coldbrew", label: "Cold brew", short: "Cold Brew", iced: true, oz: 10, milkOz: 2, style: "cold" },
      { id: "espresso", label: "Espresso (double)", short: "Latte", iced: false, oz: 2, milkOz: 8, style: "espresso" },
      { id: "matcha", label: "Matcha", short: "Matcha", iced: false, oz: 8, milkOz: 8, style: "matcha" },
      { id: "steamed", label: "Steamed milk only", short: "Steamer", iced: false, oz: 0, milkOz: 10, style: "steamer" }
    ],
    milk: [
      { id: "whole", label: "Whole" },
      { id: "oat", label: "Oat" },
      { id: "almond", label: "Almond" },
      { id: "two", label: "2%" },
      { id: "none", label: "None" }
    ],
    syrup: [
      { id: "banana", label: "Banana Bread" },
      { id: "vanilla", label: "Vanilla Bean" },
      { id: "bsc", label: "Brown Sugar Cinnamon" },
      { id: "none", label: "None" }
    ],
    foam: [
      { id: "none", label: "None" },
      { id: "milk", label: "Milk foam" },
      { id: "cold", label: "Cold foam" },
      { id: "bananafoam", label: "Banana cold foam" }
    ],
    topping: [
      { id: "none", label: "None" },
      { id: "cinnamon", label: "Cinnamon" },
      { id: "chip", label: "Crushed banana chip" },
      { id: "cocoa", label: "Cocoa" },
      { id: "salt", label: "Pinch of salt" }
    ]
  };

  const RECIPES = {
    banana: {
      id: "banana",
      name: "Banana Bread Syrup",
      uses: "Lattes, cold brew, matcha, cold foam.",
      keep: "Fridge 5–7 days. Shake before each pour.",
      yieldOz: 10,
      drinks: 10,
      defaultCost: 1.1,
      ingredients: [
        { item: "Ripe banana", qty: 1, unit: "" },
        { item: "Brown sugar", qty: 0.5, unit: "cup" },
        { item: "Water", qty: 0.5, unit: "cup" },
        { item: "Cinnamon", qty: 0.25, unit: "tsp" },
        { item: "Vanilla", qty: 1, unit: "tsp" }
      ],
      steps: [
        "Mash the banana in a small pan with sugar, water and cinnamon.",
        "Simmer 5 minutes, stirring, until it smells like banana bread.",
        "Take off heat, stir in vanilla, cool 10 minutes.",
        "Strain into a clean bottle. Label and refrigerate."
      ]
    },
    vanilla: {
      id: "vanilla",
      name: "Vanilla Bean Syrup",
      uses: "Any house latte. Quiet base for toppings.",
      keep: "Fridge up to 2 weeks.",
      yieldOz: 10,
      drinks: 10,
      defaultCost: 1.4,
      ingredients: [
        { item: "White sugar", qty: 0.75, unit: "cup" },
        { item: "Water", qty: 0.75, unit: "cup" },
        { item: "Vanilla extract", qty: 2, unit: "tsp" }
      ],
      steps: [
        "Warm sugar and water until the sugar dissolves. Do not boil hard.",
        "Cool 5 minutes, then stir in vanilla.",
        "Bottle, label, refrigerate."
      ]
    },
    bsc: {
      id: "bsc",
      name: "Brown Sugar Cinnamon Syrup",
      uses: "Hot lattes and oat milk drinks.",
      keep: "Fridge 10 days.",
      yieldOz: 10,
      drinks: 10,
      defaultCost: 0.9,
      ingredients: [
        { item: "Brown sugar", qty: 0.75, unit: "cup" },
        { item: "Water", qty: 0.75, unit: "cup" },
        { item: "Cinnamon", qty: 1, unit: "tsp" },
        { item: "Pinch of salt", qty: 1, unit: "" }
      ],
      steps: [
        "Simmer sugar, water and cinnamon 4 minutes.",
        "Stir in the salt, cool, bottle."
      ]
    },
    foam: {
      id: "foam",
      name: "Simple Cold Foam",
      uses: "Spoon over iced house specials.",
      keep: "Make fresh. Holds 10 minutes.",
      yieldOz: 6,
      drinks: 3,
      defaultCost: 0.6,
      ingredients: [
        { item: "Cold milk (2% or whole)", qty: 0.5, unit: "cup" },
        { item: "Syrup of choice", qty: 1, unit: "tbsp" }
      ],
      steps: [
        "Add milk and syrup to a jar or frother.",
        "Shake or froth 20–30 seconds until thick but pourable.",
        "Spoon over ice. Banana version: use banana bread syrup."
      ]
    }
  };

  const STATION = [
    "Kettle or coffee maker",
    "Coffee or a jar of cold brew",
    "Milk you actually like",
    "One homemade syrup",
    "Spare empty bottle + a label",
    "Glasses or mugs",
    "Ice",
    "Small whisk or handheld frother",
    "Cinnamon or cocoa",
    "Measuring spoons",
    "Funnel",
    "Fridge spot for syrup (5–7 days)",
    "Towel",
    "Trash bowl for peels and grounds"
  ];

  function fillSelect(id, items, preferred) {
    const el = document.getElementById(id);
    el.innerHTML = items.map(function (item) {
      const selected = item.id === preferred ? " selected" : "";
      return '<option value="' + item.id + '"' + selected + '>' + item.label + '</option>';
    }).join('');
  }

  function getOption(group, id) {
    return OPTIONS[group].find(function (item) { return item.id === id; });
  }

  function fmtQty(qty, unit) {
    const rounded = Math.round(qty * 100) / 100;
    const text = Number.isInteger(rounded) ? String(rounded) : String(rounded);
    return unit ? text + ' ' + unit : text;
  }

  function drinkState() {
    return {
      base: document.getElementById('base').value,
      milk: document.getElementById('milk').value,
      syrup: document.getElementById('syrup').value,
      foam: document.getElementById('foam').value,
      topping: document.getElementById('topping').value
    };
  }

  function setDrinkState(state) {
    ['base', 'milk', 'syrup', 'foam', 'topping'].forEach(function (key) {
      if (state[key]) document.getElementById(key).value = state[key];
    });
  }

  function drinkName(state) {
    const base = getOption('base', state.base);
    const milk = getOption('milk', state.milk);
    const syrup = getOption('syrup', state.syrup);
    const foam = getOption('foam', state.foam);
    const bits = [];
    if (syrup.id !== 'none') bits.push(syrup.label);
    if (foam.id === 'bananafoam') bits.push('Banana Cold Foam');
    else if (foam.id === 'cold') bits.push('Cold Foam');
    if (milk.id === 'oat') bits.push('Oat');
    else if (milk.id === 'almond') bits.push('Almond');
    if (base.style === 'matcha') bits.push('Matcha');
    else if (base.style === 'cold') bits.push('Cold Brew');
    else if (base.style === 'steamer') bits.push('Steamer');
    else if (base.style === 'espresso' || base.style === 'drip') bits.push('Latte');
    return bits.filter(Boolean).join(' ') || 'House Coffee';
  }

  function drinkLines(state) {
    const base = getOption('base', state.base);
    const milk = getOption('milk', state.milk);
    const syrup = getOption('syrup', state.syrup);
    const foam = getOption('foam', state.foam);
    const topping = getOption('topping', state.topping);
    const lines = [];
    if (base.style === 'espresso') lines.push('2 espresso shots');
    else if (base.style === 'matcha') lines.push('1 tsp matcha + 2 oz hot water');
    else if (base.style === 'steamer') lines.push('No coffee base — milk is the drink');
    else lines.push(base.oz + ' oz ' + base.label.toLowerCase());
    if (syrup.id !== 'none') lines.push('1 oz ' + syrup.label.toLowerCase() + ' syrup');
    if (milk.id !== 'none') lines.push(base.milkOz + ' oz ' + milk.label.toLowerCase() + ' milk');
    if (foam.id !== 'none') lines.push('Spoon of ' + foam.label.toLowerCase());
    if (topping.id !== 'none') lines.push(topping.label);
    if (base.iced) lines.push('Serve over ice');
    else lines.push('Serve hot');
    return lines;
  }

  function renderDrink() {
    const state = drinkState();
    const name = drinkName(state);
    document.getElementById('drink-name').textContent = name;
    document.getElementById('drink-lines').innerHTML = drinkLines(state)
      .map(function (line) { return '<li>' + line + '</li>'; })
      .join('');
    document.getElementById('drink-note').textContent =
      'Rule of thumb: 1 oz syrup per 8–12 oz of drink. Taste, then add another teaspoon if you want it sweeter.';
    return { state: state, name: name };
  }

  function renderCalc() {
    const recipeId = document.getElementById('calc-recipe').value;
    const scale = Number(document.getElementById('calc-batch').value);
    const recipe = RECIPES[recipeId];
    const costs = JSON.parse(localStorage.getItem(LS_COST) || '{}');
    const cost = costs[recipeId + ':' + scale] != null
      ? Number(costs[recipeId + ':' + scale])
      : Math.round(recipe.defaultCost * scale * 100) / 100;
    document.getElementById('calc-title').textContent = recipe.name;
    document.getElementById('calc-yield').textContent =
      'Yield about ' + Math.round(recipe.yieldOz * scale) + ' oz · ' +
      Math.round(recipe.drinks * scale) + ' drinks';
    document.getElementById('calc-lines').innerHTML = recipe.ingredients.map(function (ing) {
      return '<li>' + fmtQty(ing.qty * scale, ing.unit) + ' ' + ing.item.toLowerCase() + '</li>';
    }).join('');
    document.getElementById('calc-steps').innerHTML = recipe.steps.map(function (step) {
      return '<li>' + step + '</li>';
    }).join('');
    const costInput = document.getElementById('calc-cost');
    if (document.activeElement !== costInput) costInput.value = cost.toFixed(2);
    const drinks = Math.max(1, Math.round(recipe.drinks * scale));
    document.getElementById('calc-per-drink').textContent =
      'About $' + (cost / drinks).toFixed(2) + ' of syrup per drink.';
  }

  function renderStation() {
    const saved = JSON.parse(localStorage.getItem(LS_STATION) || '{}');
    const list = document.getElementById('station-list');
    list.innerHTML = STATION.map(function (item, index) {
      const checked = saved[index] ? ' checked' : '';
      return '<li><input type="checkbox" id="st-' + index + '" data-i="' + index + '"' + checked +
        '><label for="st-' + index + '">' + item + '</label></li>';
    }).join('');
    const done = Object.keys(saved).filter(function (key) { return saved[key]; }).length;
    document.getElementById('station-progress').textContent = done + ' / ' + STATION.length + ' ready';
  }

  function saveStationFromDom() {
    const saved = {};
    document.querySelectorAll('#station-list input').forEach(function (box) {
      saved[box.getAttribute('data-i')] = box.checked;
    });
    localStorage.setItem(LS_STATION, JSON.stringify(saved));
    renderStation();
  }

  function renderRecipes() {
    const grid = document.getElementById('recipe-grid');
    grid.innerHTML = ['banana', 'vanilla', 'bsc', 'foam'].map(function (id) {
      const recipe = RECIPES[id];
      return '<article class="card"><h3>' + recipe.name + '</h3><p>' + recipe.uses +
        '</p><ul class="recipe-lines">' +
        recipe.ingredients.map(function (ing) {
          return '<li>' + fmtQty(ing.qty, ing.unit) + ' ' + ing.item.toLowerCase() + '</li>';
        }).join('') +
        '</ul><p class="hint">' + recipe.keep + '</p></article>';
    }).join('');
  }

  function init() {
    fillSelect('base', OPTIONS.base, 'coldbrew');
    fillSelect('milk', OPTIONS.milk, 'oat');
    fillSelect('syrup', OPTIONS.syrup, 'banana');
    fillSelect('foam', OPTIONS.foam, 'cold');
    fillSelect('topping', OPTIONS.topping, 'cinnamon');
    fillSelect('calc-recipe', [
      { id: 'banana', label: 'Banana Bread Syrup' },
      { id: 'vanilla', label: 'Vanilla Bean Syrup' },
      { id: 'bsc', label: 'Brown Sugar Cinnamon Syrup' },
      { id: 'foam', label: 'Simple Cold Foam' }
    ], 'banana');
    renderDrink();
    renderCalc();
    renderStation();
    renderRecipes();
    ['base', 'milk', 'syrup', 'foam', 'topping'].forEach(function (id) {
      document.getElementById(id).addEventListener('change', renderDrink);
    });
    document.getElementById('calc-recipe').addEventListener('change', renderCalc);
    document.getElementById('calc-batch').addEventListener('change', renderCalc);
    document.getElementById('calc-cost').addEventListener('change', function () {
      const recipeId = document.getElementById('calc-recipe').value;
      const scale = document.getElementById('calc-batch').value;
      const costs = JSON.parse(localStorage.getItem(LS_COST) || '{}');
      costs[recipeId + ':' + scale] = Number(document.getElementById('calc-cost').value || 0);
      localStorage.setItem(LS_COST, JSON.stringify(costs));
      renderCalc();
    });
    document.getElementById('save-fav').addEventListener('click', function () {
      const built = renderDrink();
      localStorage.setItem(LS_FAV, JSON.stringify(built));
      document.getElementById('fav-status').textContent = 'Saved “' + built.name + '” on this device.';
    });
    document.getElementById('load-fav').addEventListener('click', function () {
      const raw = localStorage.getItem(LS_FAV);
      if (!raw) {
        document.getElementById('fav-status').textContent = 'No favorite yet.';
        return;
      }
      const saved = JSON.parse(raw);
      setDrinkState(saved.state);
      renderDrink();
      document.getElementById('fav-status').textContent = 'Loaded “' + saved.name + '”.';
    });
    document.getElementById('copy-drink').addEventListener('click', function () {
      const built = renderDrink();
      const text = built.name + '\n- ' + drinkLines(built.state).join('\n- ');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          document.getElementById('fav-status').textContent = 'Recipe copied.';
        });
      }
    });
    document.getElementById('station-list').addEventListener('change', saveStationFromDom);
    document.getElementById('station-reset').addEventListener('click', function () {
      localStorage.removeItem(LS_STATION);
      renderStation();
    });
  }

  init();
})();
