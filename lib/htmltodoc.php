<?php

final class ToDoc {

    private static $site = "https://logger-temp.opc.aval/dev/salesbase2",
            $images = '',
            $image_names = '',
            $image_count = 0,
            $gldir = "file:///C:/AF22D505/";

    final public static function getContent($name, $html, $style = '', $charset = 'Windows-1251') {
        $html = str_replace('\\', '', $html);
        $nameFile = $name . '.doc';

//        self::$gldir = $dir;


        /* doc_file_part_na_habrahabr - это название части файла может быть любым. Для того, чтобы узнать подробнее, читайте про MIME или как отправить по почте файл с картинками, аналогия очевидна.  */

        $head = 'MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="doc_file_part"


--doc_file_part
Content-Location: ' . self::$gldir . $nameFile . '
Content-Transfer-Encoding: quoted-printable
Content-Type: text/html; charset="windows-1251"


<html xmlns:o=3D"urn:schemas-microsoft-com:office:office"
xmlns:w=3D"urn:schemas-microsoft-com:office:word"
xmlns:v="urn:schemas-microsoft-com:vml"
xmlns=3D"http://www.w3.org/TR/REC-html40"><head>
<meta http-equiv=3DContent-Type content=3D"text/html; charset=3Dcp1251">
<meta name=3DProgId content=3DWord.Document>
<meta name=3DGenerator content=3D"Microsoft Word 11">
<meta name=3DOriginator content=3D"Microsoft Word 11">
<link rel=3DFile-List href=3D"filelist.xml">
<!--[if gte mso 9]><xml>
 <w:WordDocument>
  <w:View>Print</w:View>
  <w:GrammarState>Clean</w:GrammarState>
  <w:ValidateAgainstSchemas/>
  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
  <w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel>
 </w:WordDocument>
</xml><![endif]--><!--[if gte mso 9]><xml>
 <w:LatentStyles DefLockedState=3D"false" LatentStyleCount=3D"156">
 </w:LatentStyles>
</xml><![endif]-->
<style>
' . $style . '
</style>
</head>
<body>
';

        $end = '
</body>
</html>
';
//    Core::message(Core::MSG_ERROR, '=' . $html);
        $html = static::xml_entities($html, $charset);
        $fi1 = array("&lt;", "&gt;",);
        $re1 = array("<", ">");
        $html = str_replace($fi1, $re1, $html);

        /* Мы получили все картинки, теперь сгенерим xml файл с ними */
        $fileList = '
--doc_file_part
Content-Location: ' . self::$gldir . 'filelist.xml
Content-Transfer-Encoding: quoted-printable
Content-Type: text/xml; charset="cp1251"

<xml xmlns:o=3D"urn:schemas-microsoft-com:office:office">
 <o:MainFile HRef=3D"../' . $nameFile . '"/>
 ' . self::$image_names . '
 <o:File HRef=3D"filelist.xml"/>
</xml>
';

        $content = $head . $html . $end . self::$images . $fileList . '--doc_file_part--';

//        return $content = iconv('UTF-8', $charset, $content);
//        return $content = mb_convert_encoding($content, "Windows-1251", "utf-8");
        return $content = mb_convert_encoding($content, $charset, "utf-8");
//        return $content;
    }

    private static function prepareImage($matches) {
        $imgfile = PATH_PUB . '/' . $matches[2];
//        $fi1 = array("//", "//",);
//        $re1 = array("/", "/");
//        $imgfile=  str_replace($fi1, $re1 , $imgfile);
        $imgfile = preg_replace('/[\/]{2,}/', '/', $imgfile);
        $imgbinary = fread(fopen($imgfile, "r"), filesize($imgfile));
        $url = self::$site . $matches[1];
        $data = chunk_split(base64_encode($imgbinary));

        self::$image_count++;

        $ext = substr($matches[2], strpos($matches[2], '.') + 1, strlen($matches[2]));

        $imgName = 'images' . self::$image_count . '.' . $ext;

        self::$images .= '
--doc_file_part
Content-Location: ' . self::$gldir . 'images/' . $imgName . '
Content-Transfer-Encoding: base64
Content-Type: images/' . $ext . '

' . $data . '
';

        $pr1 = $matches[1];
        $pr2 = $matches[3];

        self::$image_names .= '
<o:File HRef=3D"' . $imgName . '"/>';

        return '<v:imagedata src=3D"' . self::$gldir . 'images/' . $imgName . '" o:href=3D"' . $url . '"/></v:shape><![endif]--><![if !vml]><span style=3D"mso-ignore:vglayout;"><img border=3D0 src=3D"' . self::$gldir . 'images/' . $imgName . '" alt=3DHaut v:shapes=3D"_x0000_i1057"' . $pr1 . ' ' . $pr2 . '></span><![endif]>
';
    }

    private static function xml_entities($text, $charset = 'cp1251') {

        /* Ищем изображения и добавляем их в файл */
        $text = preg_replace_callback(
                '/<img([a-zA-Z0-9:\/\.\-\?=_&\s;"]*)src="([А-Яа-яa-zA-Z\d\s:\/\.\-\?=_&]*)"([a-zA-Z0-9:\/\.\-\?=_&\s;"\'()]*)>/', "static::prepareImage", $text);

        /* Преобразовываем ссылки относительные на глобальные */
        $text = preg_replace('/href="/', 'href=3D"' . self::$site, $text);


        /* Все пробелы должны быть закодированы как =3D, 3D - это шестнадцатиричный код пробела */
        $text = preg_replace('/=(?!3D)/', '=3D', $text);
//    $text = preg_replace('/=(\'|")/', '=3D$1', $text);

        $text = preg_replace('/\s?=\s?"/', '=3D"', $text);

        /* Кодируем текст, чтобы читался в OpenOffice */
//    $text = htmlentities($text, null, $charset);
        $fi = array("", "&", "'", "<", ">");
        $re = array('"', "&", "'", "<", ">");
        return str_replace($fi, $re, $text);
    }

    public static function approval($realname, $style1, $style2) {
        $approval = "
    <table >
        <tr " . $style1 . ">
            <td >
                Цим я, " . $realname . ", надаю Публічному акціонерному товариству \"Банк\" (надалі – Банк) згоду на здійснення без обмежень будь-яких дій щодо обробки моїх персональних даних з метою:
                <dl>
                     <dt> - надання Банком фінансових послуг та провадження іншої діяльності відповідно до статуту Банку та законодавства України;
                     <dt> - виконання умов договорів, що були/будуть укладені між мною і Банком/між Банком та іншими особами, представником яких я виступаю;
                     <dt> - реалізації та захисту прав сторін за укладеними договорами;
                     <dt> - направлення мені інформаційних, рекламних повідомлень та пропозицій щодо послуг Банку, його партнерів, для моєї участі в програмах Банку та його партнерів; 
                     <dt> - виконання інших повноважень, функцій, обов’язків Банку, що не суперечать  законодавству України та укладеним договорам.
                </dl>
                При цьому Банк уповноважується здійснювати обробку персональних даних в обсязі інформації, що була/буде отримана Банком від мене особисто, від моїх представників, від третіх осіб, у т.ч. бюро кредитних історій, з кредитного реєстру Національного банку України, інших осіб, представником яких я виступаю, стала відома під час надання Банком послуг, або отримана із загальнодоступних джерел, а також змінювати/доповнювати мої персональні дані за інформацією третіх осіб. 
                <br>З метою реалізації прав сторін за укладеними договорами, забезпечення якості і безпеки обслуговування, надаю згоду на аудіозапис/запис моїх телефонних розмов з працівниками Банку, фото/відео-зйомку в приміщеннях і банкоматах Банку на магнітний та/або електронний носій та надаю згоду на  використання Банком результатів записів/зйомок, у т.ч. як доказів.  
                <br>Без отримання додаткової письмової згоди та окремого повідомлення, я надаю Банку згоду поширювати мої персональні дані, здійснювати їх передачу третім особам, у тому числі за межі України, іноземним суб'єктам відносин,  або надавати доступ до них третім особам, зокрема:
                <dl>
                    <dt>- для забезпечення виконання третіми особами своїх функцій або надання послуг Банку, зокрема, аудиторам, страховим компаніям, оцінювачам, платіжним системам, установам, що здійснюють ідентифікацію, авторізацію та процесинг операцій, іншим банкам-контрагентам та іншим особам, якщо такі функції та послуги стосуються діяльності Банку, здійснюваних ним операцій, випущених ним платіжних та інших інструментів, або є необхідними для надання Банком відповідних послуг, а також партнерам Банку;
                    <dt>- при настанні підстав для передачі третім особам банківської таємниці згідно з законодавством України або відповідно до умов укладених договорів;
                    <dt>- на користь акціонерів Банку, зокрема Європейському банку реконструкції та розвитку,  Raiffeisen Bank International AG ((Відень, Австрія) та будь-яких осіб, що за характером корпоративних зв‘язків належать до групи Райффайзен в Україні та за кордоном;
                    <dt>- розпорядникам  персональних даних клієнтів АТ \"Банк\";
                    <dt>- особам, що надають Банку послуги з організації поштових відправлень, телефонних дзвінків, відправлень SMS-повідомлень, відправлень електронною поштою  інформації щодо виконання укладених з Банком договорів (виписки про операції за рахунками, про строки виконання та розмір моїх зобов‘язань перед Банком тощо), інформаційних, рекламних повідомлень та пропозицій щодо послуг Банку, його партнерів; 
                    <dt>- до кредитного реєстру Національного банку України в порядку та обсягах, передбачених законодавством України;
                    <dt>- до бюро кредитних історій для отримання та формування кредитної історії, а також особам, що надають Банку послуги зі стягнення заборгованості, та іншим особам у зв‘язку зі стягненням простроченої заборгованості перед Банком; 
                    <dt>- будь-якій особі, яка придбає або отримує в забезпечення права вимоги за Кредитом; 
                    <dt>- страховику - з метою реалізації прав та/або виконання зобов’язань Банку, як вигодонабувача;; 
                    <dt>- особам, що надають Банку послуги зі зберігання клієнтських документів, створення та зберігання їх електронних копій (архівів, баз даних), а також особам, що надають послуги/ забезпечують іншу діяльність Банку, що не суперечить законодавству України.
                </dl>
                Погоджуюсь із тим, що мої заперечення щодо обробки Банком моїх персональних даних не позбавляють Банк права на обробку моїх персональних даних в межах та обсягах, визначених цією Згодою та законодавством України, та є підставою для припинення надання Банком послуг за укладеними договорами. 
                <br>З урахуванням умов цієї Згоди, засвідчую, що я в належній формі та в повному обсязі повідомлений  про склад та зміст моїх персональних даних, що були зібрані Банком, про мету збору моїх персональних даних та про осіб, яким передаються мої персональні дані, а також повідомлений  про свої права, визначені Законом України \"Про захист персональних даних\". Я повідомлений про те, що на сайті Банку (www.aval.ua.) додатково можу ознайомитися з повідомленням Банку про порядок обробки персональних даних клієнтів, про права суб’єктів персональний даних, передбачені Законом України \"Про захист персональних даних\". 
                <br>Усвідомлюючи обсяг та характер зобов‘язань Банку щодо збереження банківської таємниці, також надаю Банку згоду здійснювати розкриття (передачу) інформації, яка становить банківську або комерційну таємницю, що стала відомою Банку у процесі обслуговування та отримання послуг Банку:
                <dl>
                    <dt>- Антимонопольному комітету України,органам, які відповідно до законодавства здійснюють перевірку діяльності Банку;
                    <dt>- приватним і юридичним особам, організаціям та іншим особам у зв‘язку з укладанням/виконанням укладеного з Банком правочину, для реалізації чи захисту прав та обов‘язків сторін за такими правочинами (зокрема, страховим компаніям, аудиторам, посередникам на ринку фінансових послуг, оцінщикам, операторам телефонного зв’язку, компаніям зі збору заборгованості, архівним установам тощо), у тому числі для забезпечення виконання цими особами своїх функцій або надання послуг Банку відповідно до укладених договорів та під їх зустрічні зобов’язання про нерозголошення інформації;
                    <dt>- особам, що приймають участь в переказі коштів, зокрема, банкам-кореспондентам, платіжним системам та їх учасникам, відправникам та отримувачам переказів, іншим установам, що здійснюють ідентифікацію, авторизацію чи процесинг переказів;  
                    <dt>- акціонерам Банку, зокрема Європейському банку реконструкції та розвитку, Райффайзен Банк Інтернаціональ АГ (Raiffeisen Bank International AG) та будь-яким особам, що за характером корпоративних зв’язків належать до групи Райффайзен як в Україні, так і за кордоном;
                    <dt>- у випадках невиконання або несвоєчасного виконання зобов‘язань перед Банком;
                    <dt>- з метою здійснення фінансового моніторингу або виконання Банком вимог FATCA, зокрема, при наданні звітності та інформації на запити банків та інших осіб;
                    <dt>- з метою подачі Банком інформації до кредитного реєстру Національного банку України відповідно до вимог законодавства України;
                    <dt>- в інших випадках, передбачених Законом України \"Про банки і банківську діяльність\" та іншими актами законодавства України.
                </dl>
                <sup>1</sup>  Також, надаю Банку згоду надавати відповідним органам Пенсійного фонду та/або органам праці та соціального захисту населення інформацію щодо відкриття/закриття моїх поточних рахунків, призначених для зарахування пенсії та грошової допомоги, про зарахування сум пенсій та грошової допомоги на ці рахунки, про одержання сум пенсій та грошової допомоги з них за довіреністю більше як один рік або про відсутність одержання коштів з поточних рахунків більше як один рік, а також іншу інформацію відповідно до вимог нормативно-правових актів, що визначають порядок виплати пенсій та грошової допомоги за згодою пенсіонерів та одержувачів допомоги через їх поточні рахунки у банках. 
                <br><sup>2</sup>  Надаю Банку згоду передавати ПАТ \"Концерн Галнафтогаз\", ЄДРПОУ 31729918, інформацію про мої прізвище, ім’я та по-батькові, дату народження, стать, сімейний статус, адресу реєстрації та/або проживання, адресу електронної пошти, домашній та/або мобільний номер телефону, інформацію про дату випуску та номер лояльності co-brand картки \"Фішка\", а також про результати розрахунку Банком балів, виходячи з об’єму операцій, здійснених з використанням Ко-бренд картки (карток) \"ФІШКА\" з метою оплати товарів/робіт/послуг на території України та за її межами (розрахунок здійснюється Банком відповідно до умов Програми лояльності \"Фішка\") з метою обробки цих даних у зв’язку з участю Клієнта в Програмі лояльності \"Фішка\".
                <br><sup>3</sup>  Надаю Банку згоду передавати ТОВ \"Екопей Україна\", ЄДРПОУ 34770267, інформацію про мої прізвище, ім’я та по батькові, дату народження, стать, адресу реєстрації та/ або проживання, адресу електронної пошти, домашній та/або мобільний номер телефону та інформацію про результати розрахунку Банком Миль, виходячи з обсягу операцій, здійснених з використанням платіжних карток Visa Premium з метою оплати товарів/робіт/послуг на території України та за її межами, в т.ч. мережі Інтернет (розрахунок здійснюється Банком відповідно до умов Програми лояльності \"SmartSky\").
                <br><sup>4</sup>  Надаю Банку згоду передавати ПрАТ \"СК \"УНІКА\", ЄДРПОУ 20033533, інформацію про мої прізвище, ім’я та по батькові, реєстраційний номер облікової картки платника податків, дату народження, адресу реєстрації та/ або проживання, серію та номер паспорту для виїзду за кордон, дату його видачі з метою оформлення страхового полісу для подорожуючих за кордон.
                <br><sup>5</sup>  З метою отримання мною споживчого кредиту в ПАТ \"Ідея Банк\", надаю Банку згоду передавати ПАТ \"Ідея Банк\",  ЄДРПОУ 19390819 інформацію про мої прізвище, ім’я та по батькові, серію та номер паспорту громадянина України, дату його видачі та орган, який його видав, реєстраційний номер облікової картки платника податків, дату народження, стать, адресу реєстрації та/ або проживання, домашній та/або мобільний номер телефону, номер та реквізити відкритого в Банку з метою зарахування кредитних коштів рахунку, інформацію про мій фінансовий стан та місце роботи, тощо, а також персональні дані про будь-яких інших фізичних осіб  (у тому числі членів моєї родини), зокрема інформацію про їх прізвища, імена та по батькові, а також їх мобільні номери телефонів. При цьому, я  засвідчую та гарантую, що у тих випадках, коли мною передаються  персональні дані про будь-яких інших фізичних осіб  (у тому числі членів моєї родини), така передача цих даних здійснюється мною з дотриманням вимог законодавства України і не порушує права таких осіб. Зобов’язуюсь самостійно повідомляти таких осіб про склад та зміст переданих мною їх персональних даних, про мету збору їх персональних даних та про осіб, яким передаються їх персональні дані, а також про порядок реалізації ними визначених Законом України \"Про захист персональних даних\" прав. Зобов’язуюсь відшкодувати Банку будь-які збитки та шкоду, завдані порушенням або недостовірністю цієї гарантії.
                <br><sup>6</sup>  З метою укладання між мною та ПрАТ \"СК \"УНІКА ЖИТТЯ\" договору страхування життя, надаю Банку згоду передавати ПрАТ \"СК \"УНІКА Життя\", ЄДРПОУ 34478248, інформацію про мої прізвище, ім’я та по батькові, реєстраційний номер облікової картки платника податків, дату народження, адресу реєстрації та/або проживання, дані паспорту громадянина України та суму отриманого в Банку кредиту.
                <br><sup>7</sup>  Надаю Банку згоду передавати ТОВ \"ФАКТУМ ЕД ХОК\", ЄДРПОУ  37814500 наступну інформацію відносно мене та  моєї дитини у віці від шести до вісімнадцяти років, на ім’я якої Банком емітовано Додаткову ПК   Visa  FUNcard: прізвище, ім’я та по батькові (за наявності), дата народження, стать, адреса реєстрації та/або проживання, адреса електронної пошти, домашній та/або мобільний номер телефону, а також  інформацію про кількість  здійснених з використанням ПК Visa  FUNcard   операцій оплати товарів/робіт/послуг на території України та за її межами, а також в мережі Інтернет (у тому числі, операції переказу коштів \"з картки на картку\") з метою нарахування фанів в рамках Програми лояльності для дітей та підлітків \"FUNкартка\".
                <br><sup>8</sup>  Надаю Банку згоду передавати ТОВ \"Платинум Консьєрж\", ЄДРПОУ 37449672, інформацію про мої прізвище, ім’я та по батькові, реєстраційний номер облікової картки платника податків, стать, адресу електронної пошти, мобільний номер телефону  з метою отримання  та користування послугою \"Консьєрж-сервіс\".
                <br><sup>9</sup>  Надаю Банку згоду передавати ТОВ \"Портмоне\" (ЄДРПОУ ________), ТОВ \"Компанія Профікс\" (ЄДРПОУ __________) та ТОВ \"Фінансова компанія МБК\" інформацію про мої прізвище, ім’я та по батькові (за наявності),  реєстраційний номер облікової картки платника податків, адресу реєстрації та/або проживання, суму операції оплати товарів, робіт або послуг на користь суб`єктів господарювання – постачальників послуг з метою здійснення в Системі \"Райффайзен Онлайн\" платежу в рамках Послуги \"Комунальні платежі\".
                <br><sup>10</sup>   Надаю Банку згоду передавати Мастеркард Юроп СА (Mastercard Europe SA) та всім суб’єктам, що беруть участь в забезпеченні Програми винагород Mastercard, інформацію про мої прізвище, ім’я та по батькові, реєстраційний номер облікової картки платника податків, дату народження, стать, адресу реєстрації та/ або проживання, адресу електронної пошти, домашній та/або мобільний номер телефону та інформацію про операції оплати товарів/робіт/послуг на території України та за її межами (в т.ч. мережі Інтернет), здійснені з використанням емітованих Банком ПК, які беруть участь у Програмі винагород Mastercard (види ПК, які можуть брати участь в Програмі, визначаються Тарифами на ведення та обслуговування Карткових рахунків фізичних осіб) з метою обробки цих даних у зв’язку з участю в Програмі винагород Mastercard, в т.ч. нарахування балів відповідно до умов цієї Програми.
                <br>Також, надаю Банку згоду на власний розсуд останнього та без обмеження телефонувати, направляти відомості з питань виконання договорів, інші інформаційні, рекламні повідомлення та пропозиції щодо послуг Банку, його партнерів за допомогою поштових відправлень, електронних засобів зв’язку, SMS – повідомлень, з використанням мобільного зв‘язку або мережі Інтернет тощо на поштові адреси, адреси електронної пошти, номери телефонів, що надані Банку (зазначені в будь-яких документах) або стали відомі Банку іншим чином.
                <br>Надаючи Банку Згоду на вищезазначених умовах, я усвідомлюю та погоджуюсь, що передача банківської або комерційної таємниці та/або обробка моїх персональних даних може здійснюватися, зокрема, із використанням різних засобів зв‘язку, мережі Інтернет, а також третіми особами, у тому числі за межами України та/або іноземними суб'єктами відносин, пов‘язаними з персональними даними. Усвідомлюю, що направлена (передана) таким способом інформація може стати доступною третім особам, та звільняю Банк від пов‘язаної із цим відповідальності (крім випадків, коли розкриття інформації відбулося в результаті протиправних дій Банку).
                <br>Також, цим засвідчую та гарантую, що у тих випадках, коли мною передаються Банку персональні дані про будь-яких інших фізичних осіб  (у тому числі членів моєї родини), така передача цих даних здійснюється мною з дотриманням вимог законодавства України та, якщо застосовується, Регламенту Європейського Парламенту та Ради 2016/679 від 27.04.2016 року \"Щодо захисту фізичних осіб при обробці персональних даних та про вільний рух таких даних\" (Genaral Data Protection Regulation-надалі GDPR), і не порушує права таких осіб. Зобов’язуюсь самостійно повідомляти таких осіб про склад та зміст переданих мною Банку їх персональних даних, про мету збору Банком їх персональних даних та про осіб, яким передаються їх персональні дані, а також про порядок реалізації ними визначених Законом України \"Про захист персональних даних\" та GDPR прав. Зобов’язуюсь відшкодувати Банку будь-які збитки та шкоду, завдані порушенням або недостовірністю цієї гарантії.
                <br>Цим визнаю, що умови Згоди поширюються на будь-які договори, документи та інші відносини між мною та Банком/між Банком та іншими особами, представником яких я виступаю, що виникли до підписання цієї Згоди або виникнуть у майбутньому, після її підписання, у т.ч. у зв’язку з будь-якими пропозиціями Банку, моїми зверненнями до Банку з приводу отримання послуг або вчинення будь-яких інших фактичних дій, спрямованих на отримання послуг Банку. При цьому, договори та інші документи, підписані між мною та Банком/між Банком та іншими особами, представником яких я виступаю можуть містити додаткові до Згоди умови розкриття банківської або комерційної таємниці та/або обробки персональних даних.
            </td>
        </tr>
        <tr " . $style2 . ">
            <td>
                <sup>1</sup> Застосовується лише для клієнтів, які відкривають в Банку поточні рахунки з метою зарахування пенсії та грошової допомоги.
                <br><sup>2</sup> Застосовується лише для клієнтів, які приймають участь у Програмі лояльності \"Фішка\".
                <br><sup>3</sup> Застосовується в разі приймання Клієнтом участі у Програмі лояльності \"SmartSky\".
                <br><sup>4</sup> Застосовується в разі оформлення страхового полісу для подорожуючих за кордон.
                <br><sup>5</sup> Застосовуються в разі опрацювання Банком документів Клієнта та підготовки кредитного договору для отримання Клієнтом споживчого кредиту в ПАТ \"Ідея Банк\"
                <br><sup>6</sup> Застосовується в разі укладання з ПрАТ \"СК \"УНІКА ЖИТТЯ\"   договору страхування життя при отримані кредиту в Банку. 
                <br><sup>7</sup> Застосовується у разі виписку Банком Додаткової ПК Visa FUNcard на ім’я дитини віком від шести до вісімнадцяти років до Карткового рахунку Клієнта – одного із батьків (усиновлювачів) дитини.
                <br><sup>8</sup> Застосовується в разі обслуговування Карткового рахунку Клієнта на умовах Пакету послуг \"Преміальний 3.0.\"
                <br><sup>9</sup> Застосовується у разі якщо в Дорученні на договірне списання, яке формується Клієнтом в Системі \"Райффайзен Онлайн\" в рамках Послуги  \"Комунальні платежі\", Клієнт зазначає своє прізвище, ім’я, по – батькові, реєстраційний номер облікової картки платника податків, адресу реєстрації та/або проживання.
                <br><sup>10</sup> Застосовується в разі випуску на ім’я Клієнта ПК, що беруть участь у Програмі винагород Mastercard.
            </td>
        </tr>
    </table>";
        return $approval;
    }

}

?>
