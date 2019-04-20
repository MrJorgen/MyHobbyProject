export function createDashboardLayer(font, playerEnv) {
    const LINE1 = font.size;
    const LINE2 = font.size * 2;

    return function drawDashboard(context) {
        const {score, time, coins, lives} = playerEnv.playerController;

        font.print('MARIO x ' + lives, context, 24, LINE1);
        font.print(score.toString().padStart(6, '0'), context, 24, LINE2);

        font.print('@x' + coins.toString().padStart(2, '0'), context, 88, LINE2);

        font.print('WORLD', context, 144, LINE1);
        font.print('1-1', context, 152, LINE2);

        font.print('TIME', context, 200, LINE1);
        font.print(time.toFixed().toString().padStart(3, '0'), context, 208, LINE2);
    };
}
