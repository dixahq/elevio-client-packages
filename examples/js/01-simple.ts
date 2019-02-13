import Elevio from '../../src/client';

Elevio.load('57f5cf7544681');

function setupHandlers() {
  (document.getElementById('open') as HTMLElement).onclick = () =>
    Elevio.open();

  (document.getElementById('close') as HTMLElement).onclick = () =>
    Elevio.close();

  (document.getElementById('hide-launcher') as HTMLElement).onclick = () =>
    Elevio.setSettings({
      hideLauncher: true,
    });

  (document.getElementById('show-launcher') as HTMLElement).onclick = () =>
    Elevio.setSettings({ hideLauncher: false });

  Elevio.on('widget:opened', () => {
    console.log('Elevio has opened!!!');
  });

  Elevio.on('widget:closed', () => {
    console.log('Elevio has closed!!!');
  });
}

setupHandlers();
