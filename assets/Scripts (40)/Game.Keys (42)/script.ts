namespace Game.Keys
{
  function getPress( mouse: number[], keyboard: string[], gamepad: number[], just: boolean = false )
  {
    let press: boolean = false;

    for ( let child of mouse )
    {
      if ( just )
        press = Sup.Input.wasMouseButtonJustPressed( child ) ? true : press;
      else
        press = Sup.Input.isMouseButtonDown( child ) ? true : press;
    }

    for ( let child of keyboard )
    {
      if ( just )
        press = Sup.Input.wasKeyJustPressed( child ) ? true : press;
      else
        press = Sup.Input.isKeyDown( child ) ? true : press;
    }

    for ( let child of gamepad )
    {
      if ( just )
        press = Sup.Input.wasGamepadButtonJustPressed( 0, child ) ? true : press;
      else
        press = Sup.Input.isGamepadButtonDown( 0, child ) ? true : press;
    }

    return( press );
  }

  export function getUp( just?: boolean )
  {
    return( getPress( [], [ 'UP', 'Z' ], [ 12 ], just ) );
  }

  export function getDown( just?: boolean )
  {
    return( getPress( [], [ 'DOWN', 'S' ], [ 13 ], just ) );
  }

  export function getLeft( just?: boolean )
  {
    return( getPress( [], [ 'LEFT', 'Q' ], [ 14 ], just ) );
  }

  export function getRight( just?: boolean )
  {
    return( getPress( [], [ 'RIGHT', 'D' ], [ 15 ], just ) );
  }

  export function getEnter( just?: boolean )
  {
    return( getPress( [], [ 'RETURN', 'SPACE' ], [ 0 ], just ) );
  }

  export function getReturn( just?: boolean )
  {
    return( getPress( [], [ 'ESCAPE' ], [ 1 ] ) );
  }

  export function getAll( just?: boolean )
  {
    let mouse = [ 0, 1 ];
    let keyboard = [ 'Z', 'Q', 'S', 'D', 'UP', 'DOWN', 'LEFT', 'RIGHT', 'RETURN', 'SPACE', 'ESCAPE' ];
    let gamepad = [ 0, 1, 2, 3, 12, 13, 14, 15 ];

    return( getPress( mouse, keyboard, gamepad, just ) );
  }
}