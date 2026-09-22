'use strict';
/* ============ NUTRIENT KEYS ============ */
const NK=['kcal','p','c','f','fib','sug','na','fe','ca','vA','b12','vC','vD','fol','mg','k','zn'];
const MK=['fe','ca','vA','b12','vC','vD','fol','mg','k','zn'];
/* micro profiles per 100 g: fe mg, ca mg, vA ug, b12 ug, vC mg, vD ug, folate ug, mg mg, k mg, zn mg — APPROXIMATE, by main ingredient */
const MIC={
wh:[3,30,0,0,0,0,30,60,190,1.2],mai:[1.5,25,0,0,0,0,15,25,120,.7],ri:[.4,10,0,0,0,0,8,12,35,.5],gr:[2.5,40,0,0,0,0,25,70,220,1.5],
oa:[4.7,54,0,0,0,0,56,177,429,4],cer:[6,30,150,.8,0,1.5,80,30,120,1.5],dl:[1.5,20,5,0,1,0,60,35,250,1],rc:[2.2,40,2,0,1,0,90,45,350,1.3],
sp:[2,30,5,0,10,0,100,50,300,1],vg:[.8,25,40,0,12,0,25,18,250,.4],lf:[2,90,400,0,15,0,100,50,400,.6],po:[.8,10,0,0,15,0,20,25,400,.3],
pn:[.2,480,100,.4,0,.3,12,20,90,2.5],pl:[1.5,180,250,.2,8,.1,60,35,300,1.2],ml:[.05,120,46,.5,1,.1,5,12,150,.4],cd:[.1,120,30,.4,1,.1,8,12,155,.6],
ch:[.2,700,200,1,0,.4,20,30,100,2.5],eg:[1.8,56,160,1.1,0,2,47,12,138,1.3],ck:[1,12,15,.3,0,.1,5,27,250,1.5],mu:[2,12,0,2.5,0,.1,5,22,290,4.5],
fs:[.8,30,20,2,0,4,15,30,350,.8],pr:[1.5,70,20,1,0,.1,3,40,200,1.5],fr:[.3,10,10,0,8,0,10,10,150,.1],ci:[.3,35,10,0,50,0,30,10,180,.1],
fa:[.3,15,60,0,40,0,30,15,180,.1],ba:[.3,5,3,0,9,0,20,27,360,.15],gu:[.3,18,30,0,228,0,49,22,417,.2],nt:[3.5,90,0,0,0,0,50,200,600,3.2],
al:[3.7,260,0,0,0,0,44,270,730,3.1],dt:[1,40,3,0,0,0,15,50,650,.4],sn:[2,40,0,0,5,0,30,50,400,1.5],sw:[.5,60,30,.2,0,.1,5,15,100,.5],
bk:[1.5,40,20,.1,0,0,20,15,90,.5],co:[3,60,0,.2,0,0,10,100,400,1.5],mx:[1.5,60,60,.3,5,.2,40,35,250,1],so:[2.5,100,0,0,0,0,60,60,400,1.5],
pt:[2,150,50,1,5,1,30,50,250,2],ft:[8,400,400,1,40,3,60,60,600,5],ms:[.5,6,0,.1,2,.2,20,12,300,.8],gh:[0,3,800,0,0,1.5,0,0,5,0],
bt:[.1,20,680,.2,0,1.5,3,2,30,.1],pe:[2,50,0,0,0,0,240,170,650,3],jc:[.2,10,5,0,15,0,10,8,150,.1],cw:[.3,24,0,0,2.4,0,3,25,250,.1],
co2:[2.4,14,0,0,3,0,26,32,356,1.1],ca:[.3,33,835,0,6,0,19,12,320,.2],zr:[0,0,0,0,0,0,0,0,0,0]};

const CATS={bre:['Roti & bread','roti'],ric:['Rice & grains','rice'],dal:['Dal & legumes','dtadka'],veg:['Sabzi & veg','bhindi'],pan:['Paneer','shahip'],soy:['Soya & chaap','chaap'],
nv:['Non-veg','chcurry'],egg:['Eggs','egg'],brk:['Breakfast','poha'],dai:['Dairy','curd'],fru:['Fruits','apple'],snk:['Snacks','namk'],str:['Street food','samosa'],
rst:['Restaurant & fast food','pizzav'],chn:['Chinese','chowv'],swt:['Sweets & desserts','gjam'],bev:['Beverages','tea'],fat:['Ghee, oil & spreads','ghee'],
nut:['Nuts & dry fruit','almond'],pkg:['Packaged','parleg'],thl:['Thali & combos','nthali']};

/* id|name|aliases|cat|V/E/N|kind h/r/p|meals b l d s|kcal|P|C|F|fibre|sugar|Na mg (per 100 g / 100 ml)|micro|mods|units (first = default)|default qty|colour */
const DB=`
roti|Roti / Chapati|roti · फुल्का · phulka · chapati|bre|V|h|bld|285|9.6|55|3|4|0.5|60|wh|ghee|roti (medium):40;roti (small):30;roti (large):55|2|C9A36B
tand|Tandoori roti|तंदूरी रोटी|bre|V|r|ld|275|8.5|54|2.5|3.5|0.5|300|wh|ghee|roti:60|1|C08F52
missi|Missi roti|मिस्सी रोटी|bre|V|h|ld|315|11|50|7|5.5|1|250|wh|ghee|roti:55|1|C79A4A
rumali|Rumali roti|रुमाली रोटी|bre|V|r|ld|270|8|55|1.5|2|0.5|300|mai||roti:45|1|E1C99A
bajra|Bajra roti|बाजरा रोटी|bre|V|h|ld|290|8|55|4|4|0.5|20|gr|ghee|roti:50|1|9C8A70
jowar|Jowar roti|ज्वार रोटी|bre|V|h|ld|275|8|55|1.5|4.5|0.5|20|gr|ghee|roti:45|1|D6C39A
makki|Makki di roti|मक्के की रोटी|bre|V|h|ld|300|7|58|3|5|0.5|20|gr|ghee|roti:60|1|E0B94A
naan|Plain naan|नान|bre|V|r|ld|290|9|50|5.5|2|3|450|mai||naan:90|1|D9B37B
bnaan|Butter naan|बटर नान|bre|V|r|ld|320|8.5|49|9|2|3|480|mai||naan:95|1|D9A75C
gnaan|Garlic naan|गार्लिक नान|bre|V|r|ld|330|8.5|49|10|2.2|3|500|mai||naan:95|1|D3A55A
paratha|Plain paratha|पराठा|bre|V|h|bld|330|7.5|45|13|3.5|1|400|wh|ghee|paratha:65|1|D6A24F
alup|Aloo paratha|आलू पराठा|bre|V|h|bld|270|5.5|38|10.5|3|1.5|380|wh|ghee|paratha:100|1|C99C55
panp|Paneer paratha|पनीर पराठा|bre|V|h|bld|300|10|33|14|2.5|1|420|wh|ghee|paratha:110|1|CFA25D
gobp|Gobi paratha|गोभी पराठा|bre|V|h|bld|250|6|37|9|3.5|1.2|380|wh|ghee|paratha:100|1|C8A05C
moolip|Mooli paratha|मूली पराठा|bre|V|h|bld|245|6|38|8.5|3.5|1.2|380|wh|ghee|paratha:100|1|C9A15E
methip|Methi paratha / Thepla|मेथी पराठा · थेपला|bre|V|h|bld|290|8|38|11|4.5|1.5|430|wh|ghee|paratha:80;thepla:40|1|B9A05A
lachha|Lachha paratha|लच्छा पराठा|bre|V|r|ld|340|7|45|15|2.5|1|420|wh||paratha:75|1|D8AC5E
puri|Puri|पूरी|bre|V|h|bd|380|7|45|19|3|1|300|mai||puri:25|3|E5B448
bhat|Bhatura|भटूरा|bre|V|r|ld|340|8|45|14|2|2|500|mai||bhatura:70|1|E2B655
wbread|White bread|ब्रेड · toast|bre|V|p|b|265|8|49|3.2|2.7|5|490|mai|spread|slice:28|2|EBD9B4
bbread|Brown bread|ब्राउन ब्रेड|bre|V|p|b|250|10|44|3.5|5|4|470|wh|spread|slice:28|2|C8A57A
mgbread|Multigrain bread|मल्टीग्रेन ब्रेड|bre|V|p|b|255|10|43|4|6|4|450|wh|spread|slice:30|2|B58F5E
pav|Pav / Ladi pav|पाव|bre|V|r|bs|285|8|50|5|2.5|5|480|mai||pav:40|2|E9CB92
bun|Burger bun|बन|bre|V|p|s|270|9|50|4|2.5|6|480|mai||bun:60|1|E7C07A
rusk|Rusk / toast biscuit|रस्क|bre|V|p|bs|410|10|73|8|3|10|300|bk||piece:12|3|D8A96A
rice|Steamed rice|rice · चावल · chawal · plain rice|ric|V|h|ld|130|2.7|28|0.3|0.4|0|1|ri|ghee|katori:120;cup:160;g:1|1|F2EFE6
brice|Brown rice|ब्राउन राइस|ric|V|h|ld|123|2.7|25.6|1|1.8|0.4|5|gr||katori:120;cup:160|1|C8B08A
jeera|Jeera rice|जीरा राइस|ric|V|h|ld|150|3|26|3.5|0.8|0.3|300|ri||katori:120|1|EDE3B8
pulao|Veg pulao|पुलाव|ric|V|h|ld|160|3.2|27|4.5|1.5|1|350|ri||katori:130|1|E6D08A
vbiry|Veg biryani|वेज बिरयानी|ric|V|r|ld|165|4|25|5.5|1.5|1.5|400|mx||plate:250;katori:150|1|E0B25A
cbiry|Chicken biryani|चिकन बिरयानी|ric|N|r|ld|180|9.5|22|6|1|1|400|mx||plate:300;katori:150|1|D9A04F
mbiry|Mutton biryani|मटन बिरयानी|ric|N|r|ld|200|9|21|9|1|1|450|mx||plate:300;katori:150|1|CF9645
khichdi|Dal khichdi|खिचड़ी|ric|V|h|ld|115|4.3|19|2.5|1.5|0.5|300|dl||katori:150|1|E5C878
currice|Curd rice|दही चावल|ric|V|h|ld|110|3|18|3|0.5|1|200|ri||katori:150|1|F0ECE0
lemonr|Lemon rice|नींबू चावल|ric|V|h|ld|150|3|27|3.5|1|0.5|300|ri||katori:130|1|F0DD5C
quinoa|Quinoa (cooked)|क्विनोआ|ric|V|h|ld|120|4.4|21|1.9|2.8|0.9|7|gr||katori:120|1|D9C79E
sabudk|Sabudana khichdi|साबूदाना खिचड़ी|ric|V|h|bld|175|2.5|32|4.5|1.5|1|250|ri||katori:150|1|F1E7CC
oats|Oats with milk|ओट्स · oatmeal · porridge|brk|V|p|b|380|13|66|7|10|1|6|oa|cmilk,mtype|g:1;cup:80|40|D5C4A1
cflakes|Cornflakes with milk|कॉर्नफ्लेक्स|brk|V|p|b|375|7|84|0.9|3|8|700|cer|cmilk,mtype|bowl:40;g:1|1|EBC066
chocos|Chocos with milk|चोको|brk|V|p|b|385|7|80|3.5|4|30|400|cer|cmilk,mtype|bowl:40;g:1|1|6B3E26
muesli|Muesli with milk|म्यूज़ली|brk|V|p|b|365|9|68|6|8|20|90|cer|cmilk,mtype|bowl:50;g:1|1|C8A56B
poha|Poha|पोहा|brk|V|h|b|135|2.6|24|3.2|1.5|1.2|320|gr||plate:180;katori:120|1|F0D24A
upma|Upma|उपमा|brk|V|h|b|140|3.3|22|4.5|1.8|1.2|380|gr||katori:150;plate:200|1|E6D8A6
sevai|Vermicelli / Sevai upma|सेवई|brk|V|h|b|145|3|24|4|1.5|1|330|mai||katori:150|1|EAD9A0
dhokla|Dhokla|ढोकला|brk|V|h|bs|150|6|22|4.5|2.5|5|500|dl||piece:40|3|F1DE6A
idli|Idli|इडली|brk|V|h|bl|135|4|27|0.5|1.3|0.5|230|gr||piece:45|2|F6F3EA
dosa|Plain dosa|डोसा|brk|V|r|bd|165|3.8|29|3.7|1.5|0.5|300|gr||dosa:90|1|DDB56A
mdosa|Masala dosa|मसाला डोसा|brk|V|r|bd|175|3.8|27|6|2.3|1.5|370|gr||dosa:220|1|D6A94E
rdosa|Rava dosa|रवा डोसा|brk|V|r|bd|195|4|29|7|2|1|380|gr||dosa:150|1|E0BA62
utta|Uttapam|उत्तपम|brk|V|r|bd|155|4.5|23|5|2|2|330|dl||uttapam:140|1|D9B86A
appam|Appam|अप्पम|brk|V|r|bd|135|2.4|24|2.6|1|3|150|ri||appam:60|2|F0E4C8
pesar|Pesarattu (moong dosa)|पेसरट्टू|brk|V|h|b|150|7|20|4.5|3|1|300|dl||piece:100|1|B8C270
vada|Medu vada|मेदू वड़ा|brk|V|r|bs|290|9|26|17|4|1|450|dl||vada:50|2|C9903F
besanc|Besan chilla (cheela)|चीला · बेसन चीला|brk|V|h|b|175|8|20|7|3.5|2|300|dl||chilla:70|2|D8B84E
moongc|Moong dal chilla|मूंग दाल चीला|brk|V|h|b|165|9.5|19|5.5|3.5|1|300|dl||chilla:70|2|C9CF6A
vsand|Veg sandwich (grilled)|सैंडविच|brk|V|r|bs|200|6.5|29|7|2.5|5|500|mai||sandwich:150|1|CFA05A
csand|Cheese sandwich|चीज़ सैंडविच|brk|V|r|bs|270|11|28|12|2|4|650|mai||sandwich:150|1|E0A64A
esand|Egg sandwich|एग सैंडविच|brk|E|r|bs|220|10|25|8|2|4|520|mai||sandwich:150|1|E4B65E
sprts|Sprouts (moong, raw)|अंकुरित मूंग · sprouts|brk|V|h|bs|62|5|9|0.3|2|3|10|sp||katori:80|1|A9C46A
sprch|Sprouts chaat|स्प्राउट्स चाट|brk|V|h|bs|85|5|13|1.5|3|3|300|sp||katori:100|1|B2C86D
dtadka|Dal tadka|दाल तड़का · yellow dal|dal|V|h|ld|100|5.2|12.5|3.2|2.5|1|300|dl|oil|katori:150|1|E3B93A
dfry|Dal fry|दाल फ्राई|dal|V|r|ld|115|5.5|13|4.5|2.5|1|350|dl|oil|katori:150|1|DDA932
dmakh|Dal makhani|दाल मखनी|dal|V|r|ld|145|5.5|13|8|3.5|1|400|rc||katori:150|1|6E2F1E
dplain|Dal (plain, home style)|dal · दाल|dal|V|h|ld|90|5|13|2|2.5|0.5|250|dl|oil|katori:150|1|E8C24E
moongd|Moong dal|मूंग दाल|dal|V|h|ld|95|6.5|13|1.8|3|0.5|200|dl|oil|katori:150|1|E8D45A
masoor|Masoor dal|मसूर दाल|dal|V|h|ld|95|6.5|13|1.5|3|0.5|200|dl|oil|katori:150|1|E39A3A
chanad|Chana dal|चना दाल|dal|V|h|ld|130|7|19|2.5|4|1.5|250|rc|oil|katori:150|1|DFB03C
toord|Arhar / Toor dal|अरहर दाल|dal|V|h|ld|100|6|14|2|2.5|0.5|220|dl|oil|katori:150|1|E5B840
sambar|Sambar|सांभर|dal|V|r|bld|60|3|9|1.5|2|2|350|dl||katori:150|1|C97F2B
rajma|Rajma (curry)|राजमा|dal|V|h|ld|130|6|17|4|5|1.5|350|rc|oil|katori:150|1|8E2E1F
chole|Chole (chana masala)|छोले|dal|V|h|ld|150|7|20|5|6|2|420|rc|oil|katori:150|1|B5651F
kadhi|Kadhi pakora|कढ़ी|dal|V|h|ld|95|3.2|8|5.5|0.5|2.5|300|cd||katori:150|1|E8C64F
lobia|Lobia (black-eyed peas)|लोबिया|dal|V|h|ld|120|6|17|3|4|1.5|300|rc|oil|katori:150|1|C08A4A
aloosb|Aloo sabzi (dry)|आलू की सब्ज़ी|veg|V|h|bld|130|2|18|5.5|2|1|350|po|oil|katori:100|1|E3B054
aloogb|Aloo gobhi|आलू गोभी|veg|V|h|ld|100|2.8|10|5.5|3|2|350|vg|oil|katori:100|1|E0B44A
aloomat|Aloo matar|आलू मटर|veg|V|h|ld|110|3.5|14|4.5|3|3|350|vg|oil|katori:100|1|CFA04A
jeeraal|Jeera aloo|जीरा आलू|veg|V|h|ld|130|2|19|5.5|2|1|340|po|oil|katori:100|1|E5B85A
aloot|Aloo tamatar (gravy)|आलू टमाटर|veg|V|h|ld|90|1.8|13|3.5|1.8|3|330|po|oil|katori:120|1|D9782E
bhindi|Bhindi (dry)|भिंडी|veg|V|h|ld|95|2.2|8|6|3.5|2|300|vg|oil|katori:100|1|7D8F3A
lauki|Lauki sabzi|लौकी|veg|V|h|ld|55|1.5|5|3.2|1.5|2|250|vg|oil|katori:120|1|C9C77A
tinda|Tinda|टिंडा|veg|V|h|ld|65|1.5|6|4|2|2|250|vg|oil|katori:100|1|A9B95A
baingan|Baingan bharta|बैंगन भर्ता|veg|V|h|ld|85|2|7|5.5|3|3|300|vg|oil|katori:100|1|8A6F3F
gobhi|Gobhi sabzi (dry)|गोभी|veg|V|h|ld|85|2.5|7|5|3|2|300|vg|oil|katori:100|1|D8C04A
cabbage|Cabbage sabzi|पत्ता गोभी|veg|V|h|ld|70|2|7|3.8|2.5|3|250|vg|oil|katori:100|1|B8C468
beans|Beans sabzi|बीन्स|veg|V|h|ld|75|2|8|4|3|2|260|vg|oil|katori:100|1|7FA04A
mixveg|Mix vegetable|मिक्स वेज|veg|V|h|ld|90|2.5|9|5|3|3|340|vg|oil|katori:120|1|D97F35
palaks|Palak sabzi|पालक|veg|V|h|ld|70|3|5|4.5|2.5|1|300|lf|oil|katori:100|1|4E7A2F
sarson|Sarson ka saag|सरसों का साग|veg|V|h|ld|100|4|7|6|3.5|1|300|lf|oil|katori:120|1|5A7A2E
matar|Matar (green peas curry)|मटर|veg|V|h|ld|115|5|13|5|4|3|350|vg|oil|katori:100|1|7C9C3E
mushr|Mushroom masala|मशरूम|veg|V|r|ld|90|3|6|6|1.5|2|320|ms|oil|katori:120|1|A56E3E
karela|Karela sabzi|करेला|veg|V|h|ld|85|2|7|5.5|4|1.5|250|vg|oil|katori:100|1|4E6B2A
kaddu|Kaddu (pumpkin) sabzi|कद्दू|veg|V|h|ld|70|1|10|3|1.5|5|240|vg|oil|katori:100|1|E38A2E
tori|Tori / Turai|तोरी|veg|V|h|ld|55|1.3|5|3.2|1.5|2|240|vg|oil|katori:100|1|8DAA4A
arbi|Arbi fry|अरबी|veg|V|h|ld|140|2.5|20|6|3|1|300|po|oil|katori:100|1|B59A62
sweetp|Sweet potato (boiled)|शकरकंद|veg|V|h|bs|86|1.6|20|0.1|3|4|55|po||piece:130|1|C97B4A
potato|Potato (boiled)|उबला आलू|veg|V|h|bls|90|2|20|0.1|1.8|1|10|po||piece:100|1|D9B77A
salad|Green salad (cucumber, tomato, onion)|सलाद|veg|V|h|ld|20|0.9|4.3|0.2|1.5|2.5|15|vg||plate:100;katori:60|1|8DBE5A
cuc|Cucumber|खीरा|veg|V|h|ls|15|0.7|3.6|0.1|0.5|1.7|2|vg||piece:120|1|7CB05A
tomato|Tomato|टमाटर|veg|V|h|ls|18|0.9|3.9|0.2|1.2|2.6|5|vg||piece:100|1|D8402E
onion|Onion (raw)|प्याज़|veg|V|h|ld|40|1.1|9|0.1|1.7|4|4|vg||piece:80|1|C99AB8
carrot|Carrot (gajar)|गाजर|veg|V|h|ls|41|0.9|10|0.2|2.8|4.7|69|ca||piece:70|1|E8802A
raita|Raita (boondi / cucumber)|रायता|dai|V|h|ld|60|3|6|2.8|0.5|4|250|cd||katori:100|1|EFEBDD
paneer|Paneer (raw)|पनीर|pan|V|h|bld|296|18|3.5|22|0|3|20|pn||g:1;cube:20|50|F3EBD3
pbhurji|Paneer bhurji|पनीर भुर्जी|pan|V|h|bld|200|12|5|15|1|2|300|pn|oil|katori:100|1|E7C55B
shahip|Shahi paneer|शाही पनीर|pan|V|r|ld|220|8|8|17|1|4|380|pn||katori:150|1|E39B4A
kadhaip|Kadhai paneer|कढ़ाई पनीर|pan|V|r|ld|180|9|7|14|1.5|3|400|pn||katori:150|1|C9481F
palakp|Palak paneer|पालक पनीर|pan|V|r|ld|150|8|6|11|2.5|2|360|pl||katori:150|1|4C7A2C
pbm|Paneer butter masala|पनीर बटर मसाला|pan|V|r|ld|200|7|9|15|1|4|400|pn||katori:150|1|D9672E
matarp|Matar paneer|मटर पनीर|pan|V|h|ld|165|8|9|11|2.5|3|380|pn||katori:150|1|D9902F
ptikka|Paneer tikka|पनीर टिक्का|pan|V|r|sld|220|15|7|15|1|2|450|pn||piece:25|6|E08B2E
chpaneer|Chilli paneer|चिली पनीर|pan|V|r|sld|220|10|10|15|1.5|4|600|pn||plate:150|1|B8321E
ppakora|Paneer pakora|पनीर पकोड़ा|pan|V|r|s|300|10|22|20|2|1|500|sn||piece:30|4|D9A040
soyac|Soya chunks (dry)|सोया चंक्स · nutrela|soy|V|p|ld|345|52|33|0.5|13|0|20|so||g:1|30|A37A45
soyacr|Soya chunks curry|सोया करी|soy|V|h|ld|110|11|7|4|3|1.5|400|so|oil|katori:120|1|9E5A2F
chaap|Soya chaap (tandoori / afghani)|सोया चाप|soy|V|r|sld|150|14|9|7|2|1|400|so||stick:100|2|D08A3A
chaapm|Chaap masala / malai chaap|मलाई चाप|soy|V|r|ld|180|10|8|12|1|2|450|so||plate:200|1|E2B14E
tofu|Tofu|टोफू|soy|V|p|ld|76|8|1.9|4.8|0.3|0.6|7|so||g:1|100|F1EBD5
chbreast|Chicken breast (cooked, plain)|चिकन ब्रेस्ट|nv|N|h|ld|165|31|0|3.6|0|0|74|ck||g:1|100|E9D3B0
chcurry|Chicken curry|चिकन करी|nv|N|h|ld|150|13|4|9|1|1.5|380|ck|oil|katori:150|1|C9581F
bchick|Butter chicken|बटर चिकन|nv|N|r|ld|175|13|6|11|1|4|420|ck||katori:150|1|D9531F
ctikka|Chicken tikka|चिकन टिक्का|nv|N|r|sld|160|24|3|5.5|0.5|1|450|ck||piece:30|6|D8612F
tchick|Tandoori chicken|तंदूरी चिकन|nv|N|r|ld|150|22|3|5.5|0.5|1|500|ck||piece:100|2|C4391F
fchick|Fried chicken|फ्राइड चिकन|nv|N|r|sld|280|17|10|18|0.5|0|600|ck||piece:80|2|C98A3A
c65|Chicken 65|चिकन 65|nv|N|r|sld|220|16|10|13|1|1|600|ck||plate:150|1|BA2E1F
ckeema|Chicken keema|चिकन कीमा|nv|N|h|ld|190|17|4|12|1|1|400|ck|oil|katori:120|1|9A4A2A
mcurry|Mutton curry|मटन करी|nv|N|h|ld|195|15|3|14|1|1|400|mu|oil|katori:150|1|8A3A22
mkeema|Mutton keema|मटन कीमा|nv|N|h|ld|210|18|4|14|1|1|420|mu||katori:120|1|7A3A22
rogan|Rogan josh|रोगन जोश|nv|N|r|ld|190|15|3|13|0.8|1|400|mu||katori:150|1|A9321F
seekh|Mutton seekh kebab|सीख कबाब|nv|N|r|sld|230|17|4|16|0.5|1|480|mu||piece:40|3|9A4C2A
ffry|Fish fry|फिश फ्राई|nv|N|r|ld|220|20|6|13|0.3|0|400|fs||piece:80|1|D9A04A
fcurry|Fish curry|फिश करी|nv|N|h|ld|120|12|3|7|0.5|1|350|fs||katori:150|1|C97A2F
ftikka|Fish tikka (grilled)|फिश टिक्का|nv|N|r|sld|140|22|1|5|0|0|300|fs||piece:60|4|D97A3A
prawnc|Prawn curry|झींगा करी|nv|N|h|ld|110|13|4|5|0.5|1|450|pr||katori:150|1|C96A3A
prawnf|Prawns (fried)|तले झींगे|nv|N|r|sld|200|18|8|11|0.3|0|500|pr||plate:100|1|D98A3A
egg|Boiled egg|egg · anda · उबला अंडा|egg|E|h|bls|155|13|1.1|11|0|1.1|124|eg||egg:50|2|F5F0E2
eggw|Egg white (boiled)|अंडे का सफेद|egg|E|h|bls|52|11|0.7|0.2|0|0.7|166|eg||white:33|3|F8F8F2
fegg|Fried egg|फ्राइड अंडा|egg|E|h|bls|196|14|0.8|15|0|0.4|207|eg||egg:46|2|F3E39A
omlet|Omelette|ऑमलेट|egg|E|h|bls|195|13|2|15|0.2|1|340|eg||omelette (1 egg):55;omelette (2 eggs):110|1|F0D85A
momlet|Masala omelette|मसाला ऑमलेट|egg|E|h|bls|175|11|3|13|0.4|1.4|300|eg||omelette (2 eggs):120|1|E9C94A
ebhurji|Egg bhurji|अंडा भुर्जी|egg|E|h|bld|190|11|4|14|0.5|2|350|eg||katori:100|1|E8C64A
ecurry|Egg curry|अंडा करी|egg|E|h|ld|130|8|5|9|1|2|380|eg||katori:150|1|D9782E
milk|Milk|दूध · doodh|dai|V|p|b|58|3|4.7|3|0|4.7|44|ml|mtype|glass (200 ml):200;cup (150 ml):150;ml:1|1|F6F6F2
curd|Curd / Dahi|दही · yogurt|dai|V|h|bld|60|3.1|4.7|3.3|0|4.7|46|cd|mtype,sugar|katori:100;g:1|1|F4F2EA
greek|Greek yogurt (plain)|ग्रीक योगर्ट|dai|V|p|bs|97|9|4|5|0|3.6|36|cd||katori:100|1|F6F5F0
chaas|Chach / Chaas (buttermilk)|छाछ · मट्ठा · masala chaas|bev|V|h|bld|30|1.5|3.5|1|0|3|150|cd||glass (250 ml):250;ml:1|1|F1EEDC
lassis|Sweet lassi|मीठी लस्सी|bev|V|h|bls|105|3|17|3|0|15|50|cd||glass (250 ml):250;ml:1|1|F6F0E0
cheese|Cheese slice (processed)|चीज़ स्लाइस|dai|V|p|bs|300|16|4|24|0|3|1200|ch||slice:20|1|F0B84A
mozz|Mozzarella cheese|मोज़रेला|dai|V|p|ls|280|22|2.2|22|0|1|600|ch||g:1|30|F5E9B4
apple|Apple|सेब|fru|V|h|bs|52|0.3|14|0.2|2.4|10|1|fr||apple (medium):180|1|D8342B
banana|Banana|केला|fru|V|h|bs|89|1.1|23|0.3|2.6|12|1|ba||banana (medium):110|1|F2D24A
guava|Guava|अमरूद|fru|V|h|s|68|2.6|14|1|5.4|9|2|gu||guava:150|1|9CC46A
litchi|Litchi|लीची|fru|V|h|s|66|0.8|16.5|0.4|1.3|15|1|ci||litchi:10|6|E9A2A2
strawb|Strawberry|स्ट्रॉबेरी|fru|V|h|s|32|0.7|7.7|0.3|2|4.9|1|ci||strawberry:12|6|D9303A
mango|Mango|आम|fru|V|h|s|60|0.8|15|0.4|1.6|14|1|fa||mango (medium, pulp):150;slice:60|1|F2A82A
wmelon|Watermelon|तरबूज़|fru|V|h|s|30|0.6|7.6|0.2|0.4|6.2|1|fr||bowl:200|1|E9484F
papaya|Papaya|पपीता|fru|V|h|bs|43|0.5|11|0.3|1.7|7.8|8|fa||bowl:150|1|F2953A
mmelon|Muskmelon (kharbuja)|खरबूजा|fru|V|h|s|34|0.8|8.2|0.2|0.9|7.9|16|fa||bowl:150|1|F4B96A
pear|Pear (nashpati)|नाशपाती|fru|V|h|s|57|0.4|15|0.1|3.1|10|1|fr||pear:150|1|C7D26A
orange|Orange (santra)|संतरा|fru|V|h|bs|47|0.9|12|0.1|2.4|9|0|ci||orange:130|1|F28A1E
mosambi|Sweet lime (mosambi)|मौसमी|fru|V|h|s|43|0.8|9.3|0.3|0.5|8|1|ci||piece:130|1|D8D86A
grapes|Grapes|अंगूर|fru|V|h|s|69|0.7|18|0.2|0.9|15|2|fr||katori:100|1|7A9A3A
pomeg|Pomegranate (anaar)|अनार|fru|V|h|bs|83|1.7|19|1.2|4|14|3|fr||katori:100|1|B5203F
kiwi|Kiwi|कीवी|fru|V|h|s|61|1.1|15|0.5|3|9|3|ci||kiwi:70|1|8CAA3A
pineap|Pineapple|अनानास|fru|V|h|s|50|0.5|13|0.1|1.4|10|1|ci||slice:80;bowl:150|1|F2D040
chikoo|Chikoo (sapota)|चीकू|fru|V|h|s|83|0.4|20|1.1|5.3|14|12|fr||chikoo:100|1|B98A55
coconut|Coconut (fresh)|नारियल|fru|V|h|s|354|3.3|15|33|9|6|20|co2||piece:30|1|F2EEE2
sitaphal|Custard apple (sitaphal)|सीताफल|fru|V|h|s|94|2.1|24|0.3|4.4|19|9|fr||fruit:150|1|A8C67A
jamun|Jamun|जामुन|fru|V|h|s|62|0.7|14|0.2|0.6|10|14|fr||katori:100|1|4A2A5A
chips|Potato chips|चिप्स · wafers|snk|V|p|s|540|6.5|52|34|3.5|1|650|sn||pack (small):26;pack (medium):52|1|E8B93A
namk|Namkeen mixture|नमकीन|snk|V|p|s|520|12|45|32|5|3|900|sn||handful:25;g:1|1|D9A03A
bhujia|Aloo bhujia|भुजिया|snk|V|p|s|570|11|42|40|4|2|1100|sn||g:1;handful:25|30|E2B23A
sev|Sev (besan)|सेव|snk|V|p|s|540|15|42|34|5|1.5|900|sn||g:1|30|E5B94A
moongn|Moong dal namkeen|मूंग दाल नमकीन|snk|V|p|s|500|20|45|27|5|1|800|sn||g:1|30|E0C05A
chana|Roasted chana|भुना चना|snk|V|h|s|370|20|60|6|17|6|50|rc||g:1;handful:30|30|C9A05A
makhana|Makhana (roasted)|मखाना|snk|V|h|s|360|9|70|3|7|0.5|10|gr||bowl:30;g:1|1|F1ECD8
pnut|Peanuts (roasted)|मूंगफली|snk|V|h|s|585|26|16|49|8.5|4|5|pe||handful:30;g:1|1|C88A4A
popc|Popcorn (plain, salted)|पॉपकॉर्न|snk|V|p|s|400|11|64|13|10|1|600|gr||bowl:30|1|F5E6B4
murmura|Puffed rice (murmura)|मुरमुरे|snk|V|h|bs|375|7|80|0.6|2|0|20|ri||bowl:20|1|F4F0E4
chivda|Poha chivda|चिवड़ा|snk|V|p|bs|450|7|58|21|3|3|800|sn||handful:25|1|E9D26A
mathri|Mathri|मठरी|snk|V|h|s|480|7|55|26|2|1|600|sn||piece:20|3|D9B25A
chakli|Chakli|चकली|snk|V|h|s|470|8|52|26|3|1|650|sn||piece:20|3|D3A24A
khakhra|Khakhra|खाखरा|snk|V|p|bs|400|12|60|12|8|2|700|wh||piece:15|3|D6B87A
papad|Papad (roasted)|पापड़|snk|V|p|ld|330|22|50|3|6|1|1600|dl||piece:10|1|E8CB92
samosa|Samosa|समोसा|str|V|r|s|290|4.5|30|16|2|1.5|450|sn||samosa:90|1|D9A040
kachori|Kachori|कचौरी|str|V|r|bs|350|6|40|19|3|1.5|500|sn||kachori:70|1|D49A3A
pakora|Pakora (mixed veg)|पकोड़े · bhajiya|str|V|r|s|290|7|28|17|3|1.5|500|sn||piece:20|5|D3A03A
bpak|Bread pakora|ब्रेड पकोड़ा|str|V|r|s|270|6|28|15|1.5|2|500|sn||piece:80|1|D8A542
alutikki|Aloo tikki|आलू टिक्की|str|V|r|s|200|3.2|26|9|2|1|400|po||piece:60|2|D9A853
dbhalla|Dahi bhalla (dahi vada)|दही भल्ला|str|V|r|s|145|6|17|6|2|6|380|dl||plate:200|1|EEE8D2
papdic|Papdi chaat|पापड़ी चाट|str|V|r|s|190|5|25|8|3|6|600|mx||plate:180|1|D9C07A
pani|Golgappa / Pani puri|पानी पूरी · puchka · gup-chup|str|V|r|s|200|3|30|7.5|2|3|500|mx||piece:18|6|D9B24A
bhel|Bhel puri|भेल पूरी|str|V|r|s|190|4|30|6|3|5|500|mx||plate:120|1|E3C36A
bhaji|Pav bhaji (bhaji only)|पाव भाजी|str|V|r|ld|120|3|15|5.5|3|3|450|vg||plate:200;katori:150|1|C9442A
vadap|Vada pav|वड़ा पाव|str|V|r|bs|245|6|34|10|2.5|3|520|mx||vada pav:120|1|D99A3A
momov|Veg momos (steamed)|मोमोज़|str|V|r|s|170|5|26|4.5|2|1.5|450|mx||momo:28|6|F2ECDD
momoc|Chicken momos (steamed)|चिकन मोमोज़|str|N|r|s|190|10|22|6|1|1|480|mx||momo:30|6|F0E8D8
momof|Fried momos|फ्राइड मोमोज़|str|V|r|s|260|7|29|12|2|1.5|500|mx||momo:30|6|D9A85A
sproll|Spring roll (fried)|स्प्रिंग रोल|chn|V|r|s|240|5|30|11|2|2|500|mx||piece:70|2|D9A03A
vroll|Veg roll / frankie|रोल · काठी रोल|str|V|r|ld|210|6|28|8|2|2|480|mx||roll:150|1|D9B060
croll|Chicken roll|चिकन रोल|str|N|r|ld|230|11|27|8|1.5|2|520|mx||roll:180|1|D9A050
eroll|Egg roll|एग रोल|str|E|r|ld|240|9|28|10|1.5|2|500|mx||roll:170|1|E0B060
proll|Paneer roll|पनीर रोल|str|V|r|ld|250|9|28|11|2|2|520|mx||roll:180|1|E0B868
pizzav|Pizza slice (veg)|पिज़्ज़ा|rst|V|r|ld|250|10|32|9|2|3|580|mai||slice:100|2|E8A83A
pizzan|Pizza slice (chicken)|चिकन पिज़्ज़ा|rst|N|r|ld|260|12|31|10|2|3|600|mai||slice:100|2|E09A3A
burgv|Burger (veg / aloo tikki)|बर्गर|rst|V|r|ld|240|6|34|9|2.5|5|520|mx||burger:145|1|C98A3A
burgc|Burger (chicken)|चिकन बर्गर|rst|N|r|ld|250|13|27|10|1.5|4|600|mx||burger:180|1|C98A3A
fries|French fries|फ्राइज़|rst|V|r|s|312|3.5|41|15|3.8|0.3|210|po||serving (medium):110|1|E8C05A
pastaw|Pasta (white sauce)|पास्ता|rst|V|r|ld|180|6|22|7.5|1.5|2|400|mai||plate:250|1|EAD9A8
pastar|Pasta (red sauce)|रेड सॉस पास्ता|rst|V|r|ld|150|5|25|3.5|2|4|450|mai||plate:250|1|D9532A
tsoup|Tomato soup|टमाटर सूप|rst|V|r|ld|45|1|8|1|1|4|400|vg||bowl:250|1|D9482A
chowv|Veg chowmein|चाउमीन · hakka noodles|chn|V|r|ld|150|4|24|4.5|1.8|2|550|mai||plate:300|1|D9A05A
chowc|Chicken chowmein|चिकन चाउमीन|chn|N|r|ld|170|9|23|4.5|1.5|2|600|mai||plate:300|1|D9A05A
vfried|Veg fried rice|फ्राइड राइस|chn|V|r|ld|160|3.5|27|4.5|1.2|1.5|550|ri||plate:300|1|E3C77A
cfried|Chicken fried rice|चिकन फ्राइड राइस|chn|N|r|ld|175|7|26|5|1|1|580|ri||plate:300|1|E0BE72
vmanch|Veg manchurian (gravy)|मंचूरियन|chn|V|r|ld|130|3|14|7|2|4|600|mx||katori:150|1|6A3A22
gobim|Gobi manchurian (dry)|गोभी मंचूरियन|chn|V|r|sld|210|4|22|12|2|4|650|mx||plate:150|1|8A3A22
chchick|Chilli chicken|चिली चिकन|chn|N|r|sld|200|15|10|11|1|3|650|ck||plate:150|1|A3321F
scsoup|Sweet corn soup|स्वीट कॉर्न सूप|chn|V|r|ld|45|1.5|8|1|1|2|450|vg||bowl:250|1|E8D060
gjam|Gulab jamun|गुलाब जामुन|swt|V|r|s|330|4.5|50|13|0.5|40|50|sw||piece:45|2|7A3A22
jalebi|Jalebi|जलेबी|swt|V|r|bs|390|3|65|13|0.5|45|60|sw||piece:30|3|E88A1E
rasg|Rasgulla|रसगुल्ला|swt|V|r|s|186|4|40|1.3|0|36|40|sw||piece:60|2|F5F0E0
kkatli|Kaju katli|काजू कतली|swt|V|p|s|500|9|60|25|1|50|20|sw||piece:20|2|E9E4CE
besanl|Besan ladoo|बेसन लड्डू|swt|V|h|s|470|8|55|25|2|40|30|sw||piece:40|1|D9A83A
barfi|Milk barfi|बर्फी|swt|V|r|s|400|8|55|17|0.5|50|60|sw||piece:30|2|F0E4C0
gajhal|Gajar halwa|गाजर का हलवा|swt|V|h|s|190|3.5|24|9|1.5|20|60|sw||katori:100|1|D9531F
suji|Suji halwa|सूजी हलवा|swt|V|h|s|260|3|38|11|1|25|40|sw||katori:100|1|E9B55A
kheer|Kheer|खीर|swt|V|h|s|130|3.5|20|4|0.2|15|50|sw||katori:150|1|F3ECD2
rasm|Rasmalai|रसमलाई|swt|V|r|s|220|7|26|10|0|22|80|sw||piece:65|2|EBDDB0
peda|Peda|पेड़ा|swt|V|r|s|400|8|60|14|0|55|50|sw||piece:20|2|E5CF9E
icecr|Ice cream (vanilla)|आइसक्रीम|swt|V|p|s|207|3.5|24|11|0.5|21|80|sw||scoop:60|2|F6EBC8
kulfi|Kulfi|कुल्फी|swt|V|r|s|200|5|25|9|0|22|60|sw||kulfi:80|1|EBD9A0
cakes|Cake slice (chocolate)|केक|swt|V|p|s|380|5|50|18|2|32|300|bk||slice:80|1|5A3320
pastry|Pastry (cream)|पेस्ट्री|swt|V|p|s|350|4|45|17|1|30|200|bk||piece:80|1|EFD9B4
brown|Brownie|ब्राउनी|swt|V|p|s|420|5|55|21|2|38|250|bk||piece:60|1|4A2A1A
donut|Doughnut|डोनट|swt|V|p|s|400|5|46|22|2|20|300|bk||piece:70|1|C98A4A
choc|Chocolate (milk)|चॉकलेट|swt|V|p|s|535|7.5|59|30|3|56|80|co||g:1;square:6|20|5A3220
dchoc|Dark chocolate (70%)|डार्क चॉकलेट|swt|V|p|s|598|7.8|46|43|11|24|20|co||g:1;square:6|20|3A2318
jagg|Jaggery (gud)|गुड़|swt|V|h|s|383|0.4|98|0.1|0|97|30|sw||g:1|10|B8752A
water|Water|पानी|bev|V|h|blds|0|0|0|0|0|0|0|zr||glass (250 ml):250;bottle (1 L):1000;ml:1|1|BFE4F5
tea|Tea (chai) with milk & sugar|चाय · chai|bev|V|h|bs|0|0|0|0|0|0|0|zr|milk,mtype,sugar|cup (150 ml):150;cup (100 ml):100;glass (200 ml):200;ml:1|1|B9803F
gtea|Green tea|ग्रीन टी|bev|V|h|bs|1|0|0.2|0|0|0|1|zr|sugar|cup (200 ml):200;ml:1|1|9DB46A
coffee|Coffee with milk & sugar|कॉफ़ी · filter coffee|bev|V|h|bs|0|0|0|0|0|0|0|zr|milk,mtype,sugar|cup (150 ml):150;mug (250 ml):250;ml:1|1|6A4A32
bcoffee|Black coffee|ब्लैक कॉफ़ी|bev|V|h|bs|2|0.1|0|0|0|0|5|zr|sugar|cup (150 ml):150;ml:1|1|3A2A22
ccoffee|Cold coffee (milk & sugar)|कोल्ड कॉफ़ी|bev|V|r|bs|90|2.8|13|3|0|12|45|ml||glass (250 ml):250;ml:1|1|8A6A4A
ccoffeei|Cold coffee (with ice cream)|कोल्ड कॉफ़ी आइसक्रीम|bev|V|r|s|130|3|19|5|0|17|50|ml||glass (250 ml):250|1|9A7A5A
cola|Cola (Coke / Pepsi / Thums Up)|कोल्ड ड्रिंक|bev|V|p|s|42|0|10.6|0|0|10.6|4|zr||can (330 ml):330;bottle (600 ml):600;glass (250 ml):250;ml:1|1|3A2A22
lsoda|Lemon soda (Sprite / 7UP)|स्प्राइट|bev|V|p|s|39|0|9.7|0|0|9.7|10|zr||can (330 ml):330;bottle (600 ml):600;glass (250 ml):250|1|D8EBC8
energy|Energy drink (Red Bull / Monster)|एनर्जी ड्रिंक|bev|V|p|s|45|0|11|0|0|11|40|zr||can (250 ml):250|1|C9D040
pjuice|Packaged fruit juice|जूस (पैक्ड)|bev|V|p|s|52|0.3|12.5|0.1|0.2|12|10|jc||glass (200 ml):200;ml:1|1|F2A83A
fjuice|Fresh orange juice|संतरे का जूस|bev|V|h|bs|45|0.7|10.4|0.2|0.2|8.4|1|ci||glass (200 ml):200;ml:1|1|F28A2A
mangod|Packaged mango drink (Frooti / Maaza)|फ्रूटी · माज़ा|bev|V|p|s|60|0|14.8|0|0|14.5|10|zr||bottle (250 ml):250;ml:1|1|F2A82A
cwater|Coconut water|नारियल पानी|bev|V|h|bs|19|0.7|3.7|0.2|1.1|2.6|105|cw||coconut (tender):300;glass (250 ml):250;ml:1|1|E8F0D8
sugarc|Sugarcane juice|गन्ने का रस|bev|V|r|s|65|0.2|16|0|0|15|15|sw||glass (250 ml):250;ml:1|1|BFD46A
nimbu|Nimbu pani (sweet)|नींबू पानी|bev|V|h|bs|17|0|4.3|0|0|4|50|zr||glass (250 ml):250;ml:1|1|E8E86A
bshake|Banana shake|बनाना शेक|bev|V|r|bs|95|3.2|17|2.2|0.8|13|40|ba||glass (250 ml):250|1|F2E29A
ghee|Ghee|घी|fat|V|p|bld|900|0|0|100|0|0|0|gh||tsp:5;tbsp:14|1|F0C24A
oil|Cooking oil|तेल|fat|V|p|ld|900|0|0|100|0|0|0|zr||tsp:4.5;tbsp:13.5|1|E8C83A
butter|Butter (Amul)|बटर · मक्खन|fat|V|p|bs|722|0.6|0.6|80|0|0.6|760|bt||cube (10 g):10;tsp:5|1|F5DE7A
pbutter|Peanut butter|पीनट बटर|fat|V|p|bs|588|25|20|50|6|9|400|pe||tbsp:16;tsp:5|1|C88F4A
jam|Jam (mixed fruit)|जैम|fat|V|p|bs|270|0.3|68|0.1|0.5|60|30|sw||tsp:7;tbsp:20|1|B0302A
mayo|Mayonnaise|मेयोनीज़|fat|V|p|s|680|1|3|75|0|2|600|zr||tbsp:14|1|F2EBD0
ketchup|Tomato ketchup|केचप|fat|V|p|s|100|1|25|0.1|0.3|22|900|zr||tbsp:15|1|C8291F
pickle|Pickle (achaar)|अचार|fat|V|h|ld|170|2|10|14|3|2|2500|zr||tsp:8|1|B5651F
sugar|Sugar|चीनी|fat|V|p|bs|400|0|100|0|0|100|0|zr||tsp:4|1|F8F8F4
honey|Honey|शहद|fat|V|p|bs|304|0.3|82|0|0.2|82|4|zr||tsp:7|1|E8A82A
almond|Almonds (badam)|बादाम|nut|V|h|bs|579|21|22|50|12|4|1|al||almond:1.2;g:1|8|D9B98A
cashew|Cashews (kaju)|काजू|nut|V|h|s|553|18|30|44|3.3|6|12|nt||cashew:1.6;g:1|8|EBD9AA
walnut|Walnuts (akhrot)|अखरोट|nut|V|h|bs|654|15|14|65|6.7|2.6|2|nt||walnut half:2.5;g:1|4|C9A06A
pista|Pistachios|पिस्ता|nut|V|h|s|560|20|28|45|10|8|1|nt||g:1|20|A9C46A
raisin|Raisins (kishmish)|किशमिश|nut|V|h|bs|299|3|79|0.5|3.7|59|11|dt||g:1|15|8A5A32
dates|Dates (khajoor)|खजूर|nut|V|h|bs|277|1.8|75|0.2|6.7|66|1|dt||date:8|3|5A3320
fig|Dried figs (anjeer)|अंजीर|nut|V|h|bs|249|3.3|64|0.9|9.8|48|10|dt||fig:20|2|9A6A4A
mixdry|Mixed dry fruits & nuts|ड्राई फ्रूट्स|nut|V|h|bs|540|15|40|38|7|20|10|nt||handful:30|1|C89A5A
parleg|Parle-G biscuits|पारले-जी|pkg|V|p|bs|450|7|77|13|2|24|300|bk||biscuit:4.6;pack (56 g):56|5|E8D8A8
goodday|Good Day butter cookies|गुड डे|pkg|V|p|bs|480|6.5|66|20|1.5|25|350|bk||biscuit:10|3|E8C77A
marie|Marie Gold biscuits|मैरी|pkg|V|p|bs|440|8|74|12|2|15|400|bk||biscuit:5.5|4|EBD9A8
hidese|Hide & Seek (chocolate chip)|हाइड एंड सीक|pkg|V|p|s|480|6|66|21|2|32|250|bk||biscuit:8|3|6A4030
oreo|Oreo|ओरियो|pkg|V|p|s|480|4.7|70|20|2|38|400|bk||biscuit:11|3|2A2A2A
bourb|Bourbon biscuits|बॉर्बन|pkg|V|p|s|470|5|70|19|2|33|300|bk||biscuit:12|3|5A3A2A
digest|Digestive biscuits|डाइजेस्टिव|pkg|V|p|bs|480|7|65|21|3.5|17|450|bk||biscuit:15|2|D8B87A
dmilk|Cadbury Dairy Milk|डेयरी मिल्क|pkg|V|p|s|530|7.5|58|30|2|56|80|co||square:6;bar (small):13;bar (medium):40|1|4A2A6A
dsilk|Dairy Milk Silk|डेयरी मिल्क सिल्क|pkg|V|p|s|545|7|56|32|2|54|80|co||bar (60 g):60;square:6|1|5A2A6A
kitkat|KitKat|किटकैट|pkg|V|p|s|515|6.5|63|26|1|45|80|co||bar (4-finger):37|1|C9252A
kurk|Kurkure|कुरकुरे|pkg|V|p|s|535|6|54|33|2|3|1000|sn||pack (small):25;pack (medium):50|1|E86A2A
bingo|Bingo Mad Angles|बिंगो|pkg|V|p|s|520|7|55|29|3|2|850|sn||pack:28|1|E8A02A
maggi|Instant noodles (Maggi / Yippee, dry weight)|मैगी · Yippee · Top Ramen|pkg|V|p|bsd|425|9|60|17|2.5|3|1800|mai||pack:70|1|E6C25A
whey|Whey protein powder|व्हे प्रोटीन|pkg|V|p|bs|400|80|8|6|0|4|300|pt||scoop (33 g):33|1|E8E4DA
pbar|Protein bar (≈20 g protein)|प्रोटीन बार|pkg|V|p|s|385|32|37|12|8|8|250|pt||bar (60 g):60|1|6A4A3A
bvita|Bournvita / Horlicks (powder)|बॉर्नविटा|pkg|V|p|bs|380|7|80|3.5|3|68|300|ft||tsp:8;tbsp:20|2|6A3A22
`;

/* composites: id|name|aliases|cat|V/E/N|kind|meals|parts (id:grams)|mods|colour */
const COMP=`
brbutter|Bread + butter|ब्रेड बटर · toast butter|brk|V|h|b|wbread:56,butter:10||F1DDA0
bbbutter|Brown bread + butter|ब्राउन ब्रेड बटर|brk|V|h|b|bbread:56,butter:10||C8A57A
brpb|Bread + peanut butter|ब्रेड पीनट बटर|brk|V|h|b|wbread:56,pbutter:16||D9B070
bbpb|Brown bread + peanut butter|ब्राउन ब्रेड पीनट बटर|brk|V|h|b|bbread:56,pbutter:16||C8A060
brjam|Bread + jam|ब्रेड जैम|brk|V|h|b|wbread:56,jam:14||C8402A
brom|Bread omelette|ब्रेड ऑमलेट|brk|E|r|b|wbread:56,omlet:110||F0D060
idlis|Idli sambhar (3 idli)|इडली सांभर|brk|V|r|bl|idli:135,sambar:150||E9DDC0
vadas|Vada sambhar (2 vada)|वड़ा सांभर|brk|V|r|b|vada:100,sambar:120||C9903F
poorib|Puri bhaji (3 puri)|पूरी भाजी|brk|V|h|bd|puri:75,aloosb:150||E5B448
alupc|Aloo paratha with curd|आलू पराठा दही|brk|V|h|b|alup:100,curd:100||C99C55
cholebh|Chole bhature (2 bhature)|छोले भटूरे|str|V|r|ld|bhat:140,chole:150,onion:20||B5651F
pavb|Pav bhaji (2 pav + bhaji)|पाव भाजी|str|V|r|ld|pav:80,bhaji:200,butter:5||C9442A
dalch|Dal chawal|दाल चावल|thl|V|h|ld|rice:150,dtadka:150||E3B93A
rajch|Rajma chawal|राजमा चावल|thl|V|h|ld|rice:150,rajma:150||8E2E1F
chch|Chole chawal|छोले चावल|thl|V|h|ld|rice:150,chole:150||B5651F
kadhich|Kadhi chawal|कढ़ी चावल|thl|V|h|ld|rice:150,kadhi:150||E8C64F
drs|Dal + roti + sabzi (home meal)|दाल रोटी सब्ज़ी|thl|V|h|ld|roti:80,dplain:150,aloogb:100||E0B44A
paneerr|Paneer sabzi + 2 roti|पनीर सब्ज़ी रोटी|thl|V|h|ld|kadhaip:150,roti:80||C9481F
nthali|North Indian thali (veg)|नॉर्थ इंडियन थाली|thl|V|r|ld|roti:80,rice:120,dtadka:150,mixveg:100,curd:100,salad:60||E3B93A
sthali|South Indian thali (meals)|साउथ इंडियन थाली|thl|V|r|ld|rice:240,sambar:150,cabbage:100,curd:100,papad:10||C97F2B
nvthali|Non-veg thali|नॉन-वेज थाली|thl|N|r|ld|roti:80,rice:120,chcurry:150,dtadka:100,salad:60||C9581F
bchnaan|Butter chicken + naan|बटर चिकन नान|thl|N|r|ld|bchick:200,bnaan:95||D9531F
bironr|Chicken biryani + raita|बिरयानी रायता|thl|N|r|ld|cbiry:300,raita:100||D9A04F
bvm|Bournvita milk|बॉर्नविटा दूध|bev|V|h|bs|milk:200,bvita:16|mtype|6A3A22
pshake|Protein shake (whey + milk)|प्रोटीन शेक|bev|V|h|bs|whey:33,milk:250|mtype|E8E4DA
haldid|Haldi doodh (turmeric milk)|हल्दी दूध|bev|V|h|d|milk:200,sugar:4|mtype|F0C24A
`;

/* look-alike guide: foods people confuse. tip = how to tell them apart */
const GUIDE=[
{t:'Dal makhani vs dal tadka vs dal fry',ids:['dmakh','dtadka','dfry'],tip:'Makhani is dark brown-maroon and creamy, often with butter or cream on top. Tadka is yellow and thin with a red chilli–jeera tempering. Dal fry is thicker with an onion-tomato base.'},
{t:'Parathas',ids:['paratha','alup','panp','gobp','lachha','methip'],tip:'Plain and lachha parathas have no filling — lachha shows visible layers. Aloo bulges soft and pale yellow. Paneer is crumbly and whiter. Gobhi shows cauliflower flecks. Methi/thepla is green-flecked and thinner.'},
{t:'Paneer dishes',ids:['shahip','kadhaip','palakp','pbm','matarp'],tip:'Shahi is pale orange, creamy, nutty. Kadhai is red-orange with visible capsicum and whole spices. Palak is green. Butter masala is bright tomato-orange and smooth. Matar paneer has green peas.'},
{t:'Rice preparations',ids:['rice','jeera','pulao','vbiry','khichdi','lemonr'],tip:'Steamed rice is plain white. Jeera has brown cumin seeds. Pulao has whole spices and veg pieces. Biryani is layered, coloured and oilier. Khichdi is soft and mushy with dal. Lemon rice is yellow.'},
{t:'Dosa & look-alikes',ids:['dosa','mdosa','rdosa','utta','pesar','appam'],tip:'Plain dosa is thin and pale gold. Masala dosa has a potato filling. Rava dosa is lacy and crisp. Uttapam is thick with toppings. Pesarattu is green (moong). Appam has a soft, spongy centre.'},
{t:'Soya chaap & soya',ids:['chaap','chaapm','soyacr','tofu','paneer'],tip:'Chaap comes on a stick and has a layered, fibrous bite. Chaap masala is the gravy version. Soya chunks are small, dark and spongy. Tofu is smooth, pale and soft. Paneer is firmer and crumbly.'},
{t:'Indian breads',ids:['roti','tand','naan','bnaan','rumali','missi'],tip:'Roti is thin, dry, whole wheat. Tandoori roti is thicker with charred spots. Naan is soft, puffy and made of maida. Rumali is paper-thin. Missi is besan-flecked and darker.'},
{t:'Chole, rajma & lobia',ids:['chole','rajma','lobia'],tip:'Chole is tan-brown with round chickpeas. Rajma is deep red-brown with kidney-shaped beans in thick gravy. Lobia has small cream beans with a dark eye.'},
{t:'Aloo sabzis',ids:['aloosb','aloogb','aloomat','jeeraal','aloot'],tip:'Aloo sabzi and jeera aloo are dry. Aloo gobhi has cauliflower florets. Aloo matar has green peas. Aloo tamatar is a red gravy.'}];

/* meal suggestion combos: [name, V/E/N, m(eal)/s(nack), [[id, grams]]] */
const COMBOS=[
['Paneer bhurji, 2 roti & salad','V','m',[['pbhurji',120],['roti',80],['salad',80]]],
['Moong dal chilla ×2 with curd','V','m',[['moongc',140],['curd',100]]],
['Soya chunks curry, 2 roti & curd','V','m',[['soyacr',150],['roti',80],['curd',100]]],
['Rajma chawal with salad','V','m',[['rice',150],['rajma',150],['salad',80]]],
['Dal, rice & bhindi','V','m',[['rice',120],['dtadka',150],['bhindi',100]]],
['Palak paneer & 2 roti','V','m',[['palakp',150],['roti',80]]],
['Chole with 2 roti & raita','V','m',[['chole',150],['roti',80],['raita',100]]],
['Besan chilla ×2 & sprouts chaat','V','m',[['besanc',140],['sprch',100]]],
['Tofu & vegetable plate with roti','V','m',[['tofu',120],['mixveg',150],['roti',40]]],
['Egg bhurji & 2 roti','E','m',[['ebhurji',120],['roti',80],['cuc',80]]],
['3 boiled eggs & 2 toast','E','m',[['egg',150],['wbread',56]]],
['Chicken curry, 2 roti & salad','N','m',[['chcurry',150],['roti',80],['salad',80]]],
['Tandoori chicken with salad','N','m',[['tchick',200],['salad',100]]],
['Grilled chicken, sabzi & 1 roti','N','m',[['chbreast',120],['mixveg',120],['roti',40]]],
['Fish curry with rice','N','m',[['fcurry',150],['rice',120]]],
['Dal khichdi with curd','V','m',[['khichdi',250],['curd',100]]],
['Greek yogurt, almonds & banana','V','s',[['greek',150],['almond',12],['banana',110]]],
['Roasted chana & chaas','V','s',[['chana',30],['chaas',250]]],
['Apple with peanut butter','V','s',[['apple',180],['pbutter',16]]],
['Sprouts chaat','V','s',[['sprch',150]]],
['Protein shake (whey + milk)','V','s',[['whey',33],['milk',250]]],
['Makhana & a glass of milk','V','s',[['makhana',30],['milk',200]]],
['2 boiled eggs','E','s',[['egg',100]]],
['Curd with fruit','V','s',[['curd',150],['papaya',150]]],
['Paneer tikka (6 pieces)','V','s',[['ptikka',150]]],
['Chicken tikka (6 pieces)','N','s',[['ctikka',180]]]];
