#!/bin/bash
cdatelong=$(date "+%Y-%m-%d - %H:%M:%S")

if [[ ! "$workpath" ]]; then
	workpath="$(dirname "$(realpath "$0")")"
    cd "$workpath" || exit
fi

HEADERFILE="$workpath/../public/css/colors.css"
FILE="$workpath/../public/css/colors.css.temp"

newlineReplace(){
    tr '\n' ' ' < $FILE >> $FILE.tmp && mv $FILE.tmp $FILE # Remove newlines after autoparsed section
    cat $FILE >> $HEADERFILE && rm $FILE
    echo >> $HEADERFILE
}

echo > $FILE

# COLOR ARRAY
color_list=(
primary
accent
secondary
valid
error
cancel
white
black
)

color_args=(
"clr"
"bg"
)

# TEXT COLORS
textColor_list=(
"normal"
"inverted"
"white"
"black"
"secondary"
)

echo "
/* AUTO GENERATED FILE FOR CSS COMPATIBILITY AND CUSTOMIZATION TWEAKS */
/* PARSED AT DATE: $cdatelong */
/* DYLAN BLANQUE */

/* BECAUSE VUEJS HAS MANY SUB-ELEMENTS THAT NEED TO 
HAVE HIGHER SELECTOR SPECIFICITY THIS FILE IS LONG */

/* LIGHT THEME VARIABLES */
:root {
    /* -------------- COLORS -------------- */

    /* PRIMARY */
    --clr-primary-hue: 211;
    --clr-primary-sat: 54.5%;
    --clr-primary-lig: 56.1%;
    --clr-primary: hsl(var(--clr-primary-hue), var(--clr-primary-sat), var(--clr-primary-lig));

    /* ACCENT */
    --clr-accent-hue: 29.5;
    --clr-accent-sat: 100%;
    --clr-accent-lig: 76.9%;
    --clr-accent: hsl(var(--clr-accent-hue), var(--clr-accent-sat), var(--clr-accent-lig));

    /* SECONDARY */
    --clr-secondary-hue: 210;
    --clr-secondary-sat: 7.4%;
    --clr-secondary-lig: 21.2%;
    --clr-secondary: hsl(var(--clr-secondary-hue), var(--clr-secondary-sat), var(--clr-secondary-lig));

    /* VALID */
    --clr-valid-hue: 150;
    --clr-valid-sat: 86.9%;
    --clr-valid-lig: 41.8%;
    --clr-valid: hsl(var(--clr-valid-hue), var(--clr-valid-sat), var(--clr-valid-lig));

    /* WHITE */
    --clr-white-hue: 0;
    --clr-white-sat: 0%;
    --clr-white-lig: 100%;
    --clr-white: hsl(var(--clr-white-hue), var(--clr-white-sat), var(--clr-white-lig));

    --clr-blue-hue: 206.6;
    --clr-blue-sat: 89.7%;
    --clr-blue-lig: 54.1%;
    --clr-blue: hsl(var(--clr-blue-hue), var(--clr-blue-sat), var(--clr-blue-lig));

    --clr-orange-hue: 35.8;
    --clr-orange-sat: 100%;
    --clr-orange-lig: 50%;
    --clr-orange: hsl(var(--clr-orange-hue), var(--clr-orange-sat), var(--clr-orange-lig));

    /* ERROR */
    --clr-error-hue: 0;
    --clr-error-sat: 85.9%;
    --clr-error-lig: 47.3%;
    --clr-error: hsl(var(--clr-error-hue), var(--clr-error-sat), var(--clr-error-lig));
    --clr-cancel-hue: 0;
    --clr-cancel-sat: 100%;
    --clr-cancel-lig: 54.3%;
    --clr-cancel: hsl(var(--clr-cancel-hue), var(--clr-cancel-sat), var(--clr-cancel-lig));

    /* BACKGROUND COLOR */
    --body-bg: hsl(0, 0%, 94.1%) !important;
    --body-bg-lighter: hsl(0, 0%, 98%) !important;
    --body-bg-light: hsl(0, 0%, 100%) !important;
    --body-bg-inv: var(--clr-bg);

    /* TEXT COLOR */
    --clr-text-normal: hsl(0, 0%, 100%);
    --clr-text-secondary: var(--clr-secondary-dark);
    --clr-text-inverted: var(--clr-secondary);
    --clr-text-white: hsl(0, 0%, 100%) !important;
    --clr-text-black: hsl(0, 0%, 0%) !important;
    
    /* GRADIENTS */
    --grad-header: linear-gradient(0deg, rgba(77, 93, 111, 1) 0%, rgba(46, 49, 51, 1) 125%) !important;
    
    /* TRANSITION SPEEDS */
    --trans-speed: 200ms;
    --trans-speed-med: 300ms;
    
    /* HSL Opacity Default */
    --clr-opa: 100%;
    --bg-opa: 100%;
    --hint-opa: 100%;

    --clr-lig-95:   95%;
    --clr-lig-90:   90%;
    --clr-lig-85:   85%;
    --clr-lig-80:   80%;
    --clr-lig-75:   75%;
    --clr-lig-70:   70%;
    --clr-lig-65:   65%;
    --clr-lig-60:   60%;
    --clr-lig-55:   55%;
    --clr-lig-50:   50%;
    --clr-lig-45:   45%;
    --clr-lig-40:   40%;
    --clr-lig-35:   35%;
    --clr-lig-30:   30%;
    --clr-lig-25:   25%;
    --clr-lig-20:   20%;
    --clr-lig-15:   15%;
    --clr-lig-10:   10%;
    --clr-lig-5:   5%;
    --clr-lig-0:   0%;
}

/* ------------ DARK MODE VARIABLES ------------ */
[theme=\"dark\"] {
    /* PRIMARY */
    --clr-primary-hue: 211;
    --clr-primary-sat: 54.5%;
    --clr-primary-lig: 56.1%;

    /* ACCENT */
    --clr-accent-hue: 29.5;
    --clr-accent-sat: 100%;
    --clr-accent-lig: 76.9%;

    /* SECONDARY */
    --clr-secondary-hue: 210;
    --clr-secondary-sat: 7.4%;
    --clr-secondary-lig: 73.1%;

    /* VALID */
    --clr-valid-hue: 150;
    --clr-valid-sat: 86.9%;
    --clr-valid-lig: 41.8%;

    /* ERROR */
    --clr-error-hue: 0;
    --clr-error-sat: 85.9%;
    --clr-error-lig: 59.6%;
    --clr-cancel-hue: 0;
    --clr-cancel-sat: 100%;
    --clr-cancel-lig: 54.3%;

    /* TEXT */
    --clr-text-normal: hsl(var(--clr-secondary-hue), var(--clr-secondary-sat), 15%) !important;
    --clr-text-inverted: hsl(0, 0%, 100%) !important;

    /* BG AND TRANSPARENT */
    --body-bg: hsl(210, 7.4%, 21.2%) !important;
    --body-bg-lighter: hsl(212.7, 7.7%, 28%) !important;
    --body-bg-light: hsl(213, 10%, 39.2%) !important;
    --body-bg-inv: hsl(206.7, 100%, 98.2%) !important;

    --clr-bg: hsl(210, 100%, 98.4%) !important;
    --clr-bg-tp-25: hsla(211, 46.3%, 73.7%, 0.3) !important;
    --clr-bg-tp-50: hsla(211, 40.3%, 71.8%, 0.5) !important;
    --clr-bg-tp-75: hsla(213.6, 50.8%, 74.5%, 0.8) !important;
    --clr-bg-tp-90: hsla(211.5, 42.7%, 72%, 0.9) !important;
    
    --clr-lig-95:   5%;
    --clr-lig-90:   10%;
    --clr-lig-85:   15%;
    --clr-lig-80:   20%;
    --clr-lig-75:   25%;
    --clr-lig-70:   30%;
    --clr-lig-65:   35%;
    --clr-lig-60:   40%;
    --clr-lig-55:   45%;
    --clr-lig-50:   50%;
    --clr-lig-45:   55%;
    --clr-lig-40:   60%;
    --clr-lig-35:   65%;
    --clr-lig-30:   70%;
    --clr-lig-25:   75%;
    --clr-lig-20:   80%;
    --clr-lig-15:   85%;
    --clr-lig-10:   90%;
    --clr-lig-5:    95%;
    --clr-lig-0:    100%;
}

/* START OF AUTOMATIC PARSED SECTION */" > $HEADERFILE

for arg in "${color_args[@]}"
do
    echo > $FILE

    echo ".$arg-opa-0     { --$arg-opa:    0   !important; }" >> $FILE
    echo ".$arg-opa-10    { --$arg-opa:   .1   !important; }" >> $FILE
    echo ".$arg-opa-20    { --$arg-opa:   .2   !important; }" >> $FILE
    echo ".$arg-opa-30    { --$arg-opa:   .3   !important; }" >> $FILE
    echo ".$arg-opa-40    { --$arg-opa:   .4   !important; }" >> $FILE
    echo ".$arg-opa-50    { --$arg-opa:   .5   !important; }" >> $FILE
    echo ".$arg-opa-60    { --$arg-opa:   .6   !important; }" >> $FILE
    echo ".$arg-opa-70    { --$arg-opa:   .7   !important; }" >> $FILE
    echo ".$arg-opa-80    { --$arg-opa:   .8   !important; }" >> $FILE
    echo ".$arg-opa-90    { --$arg-opa:   .9   !important; }" >> $FILE
    echo ".$arg-opa-100   { --$arg-opa:    1   !important; }" >> $FILE

    echo ".$arg-slig-5,   .$arg-slig-5::before,   .$arg-slig-5::after       { --$arg-lig:   5%     !important; }" >> $FILE
    echo ".$arg-slig-10,  .$arg-slig-10::before,  .$arg-slig-10::after      { --$arg-lig:   10%     !important; }" >> $FILE
    echo ".$arg-slig-15,  .$arg-slig-15::before,  .$arg-slig-15::after      { --$arg-lig:   15%     !important; }" >> $FILE
    echo ".$arg-slig-20,  .$arg-slig-20::before,  .$arg-slig-20::after      { --$arg-lig:   20%     !important; }" >> $FILE
    echo ".$arg-slig-25,  .$arg-slig-25::before,  .$arg-slig-25::after      { --$arg-lig:   25%     !important; }" >> $FILE
    echo ".$arg-slig-30,  .$arg-slig-30::before,  .$arg-slig-30::after      { --$arg-lig:   30%     !important; }" >> $FILE
    echo ".$arg-slig-35,  .$arg-slig-35::before,  .$arg-slig-35::after      { --$arg-lig:   35%     !important; }" >> $FILE
    echo ".$arg-slig-40,  .$arg-slig-40::before,  .$arg-slig-40::after      { --$arg-lig:   40%     !important; }" >> $FILE
    echo ".$arg-slig-45,  .$arg-slig-45::before,  .$arg-slig-45::after      { --$arg-lig:   45%     !important; }" >> $FILE
    echo ".$arg-slig-50,  .$arg-slig-50::before,  .$arg-slig-50::after      { --$arg-lig:   50%     !important; }" >> $FILE
    echo ".$arg-slig-55,  .$arg-slig-55::before,  .$arg-slig-55::after      { --$arg-lig:   55%     !important; }" >> $FILE
    echo ".$arg-slig-60,  .$arg-slig-60::before,  .$arg-slig-60::after      { --$arg-lig:   60%     !important; }" >> $FILE
    echo ".$arg-slig-65,  .$arg-slig-65::before,  .$arg-slig-65::after      { --$arg-lig:   65%     !important; }" >> $FILE
    echo ".$arg-slig-70,  .$arg-slig-70::before,  .$arg-slig-70::after      { --$arg-lig:   70%     !important; }" >> $FILE
    echo ".$arg-slig-75,  .$arg-slig-75::before,  .$arg-slig-75::after      { --$arg-lig:   75%     !important; }" >> $FILE
    echo ".$arg-slig-80,  .$arg-slig-80::before,  .$arg-slig-80::after      { --$arg-lig:   80%     !important; }" >> $FILE
    echo ".$arg-slig-85,  .$arg-slig-85::before,  .$arg-slig-85::after      { --$arg-lig:   85%     !important; }" >> $FILE
    echo ".$arg-slig-90,  .$arg-slig-90::before,  .$arg-slig-90::after      { --$arg-lig:   90%     !important; }" >> $FILE
    echo ".$arg-slig-95,  .$arg-slig-95::before,  .$arg-slig-95::after      { --$arg-lig:   95%     !important; }" >> $FILE
    echo ".$arg-slig-100, .$arg-slig-100::before, .$arg-slig-100::after     { --$arg-lig:   100%    !important; }" >> $FILE

    echo ".$arg-lig-5,   .$arg-lig-5::before,   .$arg-lig-5::after      { --$arg-lig:   5%      !important; }" >> $FILE
    echo ".$arg-lig-10,  .$arg-lig-10::before,  .$arg-lig-10::after     { --$arg-lig:   10%     !important; }" >> $FILE
    echo ".$arg-lig-15,  .$arg-lig-15::before,  .$arg-lig-15::after     { --$arg-lig:   15%     !important; }" >> $FILE
    echo ".$arg-lig-20,  .$arg-lig-20::before,  .$arg-lig-20::after     { --$arg-lig:   20%     !important; }" >> $FILE
    echo ".$arg-lig-25,  .$arg-lig-25::before,  .$arg-lig-25::after     { --$arg-lig:   25%     !important; }" >> $FILE
    echo ".$arg-lig-30,  .$arg-lig-30::before,  .$arg-lig-30::after     { --$arg-lig:   30%     !important; }" >> $FILE
    echo ".$arg-lig-35,  .$arg-lig-35::before,  .$arg-lig-35::after     { --$arg-lig:   35%     !important; }" >> $FILE
    echo ".$arg-lig-40,  .$arg-lig-40::before,  .$arg-lig-40::after     { --$arg-lig:   40%     !important; }" >> $FILE
    echo ".$arg-lig-45,  .$arg-lig-45::before,  .$arg-lig-45::after     { --$arg-lig:   45%     !important; }" >> $FILE
    echo ".$arg-lig-50,  .$arg-lig-50::before,  .$arg-lig-50::after     { --$arg-lig:   50%     !important; }" >> $FILE
    echo ".$arg-lig-55,  .$arg-lig-55::before,  .$arg-lig-55::after     { --$arg-lig:   55%     !important; }" >> $FILE
    echo ".$arg-lig-60,  .$arg-lig-60::before,  .$arg-lig-60::after     { --$arg-lig:   60%     !important; }" >> $FILE
    echo ".$arg-lig-65,  .$arg-lig-65::before,  .$arg-lig-65::after     { --$arg-lig:   65%     !important; }" >> $FILE
    echo ".$arg-lig-70,  .$arg-lig-70::before,  .$arg-lig-70::after     { --$arg-lig:   70%     !important; }" >> $FILE
    echo ".$arg-lig-75,  .$arg-lig-75::before,  .$arg-lig-75::after     { --$arg-lig:   75%     !important; }" >> $FILE
    echo ".$arg-lig-80,  .$arg-lig-80::before,  .$arg-lig-80::after     { --$arg-lig:   80%     !important; }" >> $FILE
    echo ".$arg-lig-85,  .$arg-lig-85::before,  .$arg-lig-85::after     { --$arg-lig:   85%     !important; }" >> $FILE
    echo ".$arg-lig-90,  .$arg-lig-90::before,  .$arg-lig-90::after     { --$arg-lig:   90%     !important; }" >> $FILE
    echo ".$arg-lig-95,  .$arg-lig-95::before,  .$arg-lig-95::after     { --$arg-lig:   95%     !important; }" >> $FILE
    echo ".$arg-lig-100, .$arg-lig-100::before, .$arg-lig-100::after    { --$arg-lig:   100%    !important; }" >> $FILE

    echo "[theme=\"dark\"] .$arg-lig-5,   [theme=\"dark\"] .$arg-lig-5::before,   [theme=\"dark\"] .$arg-lig-5::after       { --$arg-lig:   95%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-10,  [theme=\"dark\"] .$arg-lig-10::before,  [theme=\"dark\"] .$arg-lig-10::after      { --$arg-lig:   90%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-15,  [theme=\"dark\"] .$arg-lig-15::before,  [theme=\"dark\"] .$arg-lig-15::after      { --$arg-lig:   85%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-20,  [theme=\"dark\"] .$arg-lig-20::before,  [theme=\"dark\"] .$arg-lig-20::after      { --$arg-lig:   80%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-25,  [theme=\"dark\"] .$arg-lig-25::before,  [theme=\"dark\"] .$arg-lig-25::after      { --$arg-lig:   75%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-30,  [theme=\"dark\"] .$arg-lig-30::before,  [theme=\"dark\"] .$arg-lig-30::after      { --$arg-lig:   70%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-35,  [theme=\"dark\"] .$arg-lig-35::before,  [theme=\"dark\"] .$arg-lig-35::after      { --$arg-lig:   65%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-40,  [theme=\"dark\"] .$arg-lig-40::before,  [theme=\"dark\"] .$arg-lig-40::after      { --$arg-lig:   60%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-45,  [theme=\"dark\"] .$arg-lig-45::before,  [theme=\"dark\"] .$arg-lig-45::after      { --$arg-lig:   55%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-50,  [theme=\"dark\"] .$arg-lig-50::before,  [theme=\"dark\"] .$arg-lig-50::after      { --$arg-lig:   50%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-55,  [theme=\"dark\"] .$arg-lig-55::before,  [theme=\"dark\"] .$arg-lig-55::after      { --$arg-lig:   45%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-60,  [theme=\"dark\"] .$arg-lig-60::before,  [theme=\"dark\"] .$arg-lig-60::after      { --$arg-lig:   40%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-65,  [theme=\"dark\"] .$arg-lig-65::before,  [theme=\"dark\"] .$arg-lig-65::after      { --$arg-lig:   35%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-70,  [theme=\"dark\"] .$arg-lig-70::before,  [theme=\"dark\"] .$arg-lig-70::after      { --$arg-lig:   30%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-75,  [theme=\"dark\"] .$arg-lig-75::before,  [theme=\"dark\"] .$arg-lig-75::after      { --$arg-lig:   25%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-80,  [theme=\"dark\"] .$arg-lig-80::before,  [theme=\"dark\"] .$arg-lig-80::after      { --$arg-lig:   20%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-85,  [theme=\"dark\"] .$arg-lig-85::before,  [theme=\"dark\"] .$arg-lig-85::after      { --$arg-lig:   15%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-90,  [theme=\"dark\"] .$arg-lig-90::before,  [theme=\"dark\"] .$arg-lig-90::after      { --$arg-lig:   10%     !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-95,  [theme=\"dark\"] .$arg-lig-95::before,  [theme=\"dark\"] .$arg-lig-95::after      { --$arg-lig:   5%      !important; }" >> $FILE
    echo "[theme=\"dark\"] .$arg-lig-100, [theme=\"dark\"] .$arg-lig-100::before, [theme=\"dark\"] .$arg-lig-100::after     { --$arg-lig:   0%      !important; }" >> $FILE

    newlineReplace
done

for color in "${color_list[@]}"
do
    for ((sat=0;sat<=100;sat+=5)); do

        echo > $FILE

        if [[ $sat == 0 ]]; then
            echo ".clr-$color," >> $FILE
            echo ".clr-$color::before," >> $FILE
            echo ".clr-$color::after," >> $FILE
            echo ".clr-$color > *," >> $FILE
            echo ".clr-$color > *::before," >> $FILE
            echo ".clr-$color > *::after," >> $FILE
            echo ".clr-$color > span.v-btn__content," >> $FILE
            echo ".clr-$color > .v-input__control label," >> $FILE
            echo ".clr-$color > .v-input__control input," >> $FILE
            echo ".clr-$color > .v-input__control .v-icon," >> $FILE
            echo ".clr-$color > .v-input__control .v-select__selection" >> $FILE
            echo "{" >> $FILE
            echo "--clr-lig: var(--clr-$color-lig);" >> $FILE
            echo "color: hsl(var(--clr-$color-hue), var(--clr-$color-sat), var(--clr-lig), var(--clr-opa)) !important;" >> $FILE
            echo "}" >> $FILE

            echo >> $FILE

            echo ".bg-$color" >> $FILE
            echo "{" >> $FILE
            echo "--bg-lig: var(--clr-$color-lig);" >> $FILE
            echo "background-color: hsl(var(--clr-$color-hue), var(--clr-$color-sat), var(--bg-lig), var(--bg-opa)) !important;" >> $FILE
            echo "}" >> $FILE

            echo >> $FILE

            echo ".hint-$color .theme--light.v-messages:not(.error--text)" >> $FILE
            echo "{" >> $FILE
            echo "--hint-lig: var(--clr-$color-lig);" >> $FILE
            echo "color: hsl(var(--clr-$color-hue), var(--clr-$color-sat), var(--hint-lig), var(--hint-opa)) !important;" >> $FILE
            echo "}" >> $FILE
        else
            echo ".clr-$color-${sat}," >> $FILE
            echo ".clr-$color-${sat}::before," >> $FILE
            echo ".clr-$color-${sat}::after," >> $FILE
            echo ".clr-$color-${sat} > *," >> $FILE
            echo ".clr-$color-${sat} > *::before," >> $FILE
            echo ".clr-$color-${sat} > *::after," >> $FILE
            echo ".clr-$color-${sat} > span.v-btn__content," >> $FILE
            echo ".clr-$color-${sat} > .v-input__control label," >> $FILE
            echo ".clr-$color-${sat} > .v-input__control input," >> $FILE
            echo ".clr-$color-${sat} > .v-input__control .v-icon," >> $FILE
            echo ".clr-$color-${sat} > .v-input__control .v-select__selection" >> $FILE
            echo "{" >> $FILE
            echo "--clr-lig: var(--clr-$color-lig);" >> $FILE
            echo "color: hsl(var(--clr-$color-hue), ${sat}%, var(--clr-lig), var(--clr-opa)) !important;" >> $FILE
            echo "}" >> $FILE

            echo >> $FILE

            echo ".bg-$color-${sat}" >> $FILE
            echo "{" >> $FILE
            echo "--bg-lig: var(--clr-$color-lig);" >> $FILE
            echo "background-color: hsl(var(--clr-$color-hue), ${sat}%, var(--bg-lig), var(--bg-opa)) !important;" >> $FILE
            echo "}" >> $FILE

            echo >> $FILE

            echo ".hint-$color-${sat} .theme--light.v-messages:not(.error--text)" >> $FILE
            echo "{" >> $FILE
            echo "--hint-lig: var(--clr-$color-lig);" >> $FILE
            echo "color: hsl(var(--clr-$color-hue), ${sat}%, var(--hint-lig), var(--hint-opa)) !important;" >> $FILE
            echo "}" >> $FILE

        fi
        
        newlineReplace
    done
done

for textColor in "${textColor_list[@]}"
do
    echo > $FILE

    echo ".text-$textColor:not(.error--text, .red--text)," >> $FILE
    echo ".text-$textColor:not(.error--text, .red--text) *:not(.v-input__control, .primary--text, .stepper-number-white span)," >> $FILE
    echo ".text-$textColor:not(.error--text, .red--text) *::placeholder," >> $FILE
    echo ".text-$textColor:not(.error--text, .red--text) span.v-chip__content," >> $FILE
    echo ".text-$textColor:not(.error--text, .primary--text, .red--text) .v-input__append-inner .v-icon::before," >> $FILE
    echo ".text-$textColor:not(.error--text, .primary--text, .red--text) .v-input__prepend-inner .v-icon::before," >> $FILE
    echo ".text-$textColor:not(.error--text, .primary--text, .red--text) .v-input__append-outer .v-icon::before," >> $FILE
    echo ".text-$textColor:not(.error--text, .primary--text, .red--text) .v-input__prepend-outer .v-icon::before" >> $FILE
    echo "{" >> $FILE
    echo "color: var(--clr-text-$textColor) !important;" >> $FILE
    echo "}" >> $FILE

    echo >> $FILE

    echo ".icon-$textColor:not(.error--text, .primary--text, .red--text) .v-expansion-panel-header__icon .v-icon::before" >> $FILE
    echo "{" >> $FILE
    echo "color: var(--clr-text-$textColor) !important;" >> $FILE
    echo "}" >> $FILE

    echo >> $FILE

    echo ".text-$textColor.error--text," >> $FILE
    echo ".text-$textColor.error--text label," >> $FILE
    echo ".text-$textColor.error--text *::placeholder," >> $FILE
    echo ".text-$textColor.error--text *:not(.v-input__control)" >> $FILE
    echo "{" >> $FILE
    echo "color: var(--clr-error) !important;" >> $FILE
    echo "}" >> $FILE

    newlineReplace
done

echo "/* VueJS Native Classes */" >> $FILE && newlineReplace

echo >> $FILE
echo ".text-start:not(.error--text, .red--text):not(button)," >> $FILE
echo ".text-start:not(.error--text, .red--text) *:not(.v-input__control, button)," >> $FILE
echo ".text-start:not(.error--text, .red--text) .v-input__append-inner .v-icon::before" >> $FILE
echo "{" >> $FILE
echo "color: var(--clr-text-inverted) !important;" >> $FILE
echo "}" >> $FILE

newlineReplace