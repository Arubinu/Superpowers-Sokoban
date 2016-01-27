namespace Game.Main.Code
{
  let scene: Sup.Actor;
  let column: number = 0;
  let delay: number;
  let keys: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Getters
  export function getColumn(): number
  {
    return ( column );
  }

  export function get(): string
  {
    let code = '';
    let children = scene.getChildren();
    for ( let child of children )
    {
      if ( child.getName().length == 1 )
        code += child.getChild( 'Letter' ).textRenderer.getText()[ 0 ];
    }

    return ( code );
  }

  // Setters
  export function set( code: string ): boolean
  {
    code = code.toUpperCase()
    for ( let i = 1; i <= 4; ++i )
    {
      if ( keys.indexOf( code[ i - 1 ] ) < 0 )
        return ( false );
    }

    for ( let i = 1; i <= 4; ++i )
    {
      let child = scene.getChild( i.toString() ).getChild( 'Letter' );
      child.textRenderer.setText( code[ i - 1 ] );
    }

    return ( true );
  }

  function setColumn( number: number )
  {
    column = number;
    column = ( column < 0 ) ? 0 : column;
    column = ( column > 3 ) ? 3 : column;
  }

  function plusColumn( yes: boolean = true )
  {
    if ( yes )
      setColumn( getColumn() + 1 );
  }

  function minusColumn( yes: boolean = true )
  {
    if ( yes )
      setColumn( getColumn() - 1 );
  }

  // Methods
  export function init( actor: Sup.Actor )
  {
    scene = actor;

    set( 'Code' );
    setColumn( 0 );
  }

  export function behavior( start?: boolean )
  {
    if ( start )
    {
      if ( Game.debug )
        Sup.log( 'Game.Main.code()' );

      delay = 0;
      setColumn( 0 );
      scene.setVisible( true );
    }

    ++delay;
    let up = Game.Keys.getUp();
    let down = Game.Keys.getDown();
    let left = Game.Keys.getLeft( true );
    let right = Game.Keys.getRight( true );
    plusColumn( right );
    minusColumn( left );

    if ( Sup.Input.wasMouseButtonJustPressed( 0 ) || Sup.Input.wasTouchStarted( 0 ) )
       scene.getChild( 'OK' ).setVisible( true );

    let elems = new Array<Sup.Actor>();
    elems.push( scene.getChild( 'OK' ).getChild( 'Map' ) );
    for ( let i = 1; i <= 4; ++i )
    {
      let children = scene.getChild( i.toString() ).getChildren();
      for ( let child of children )
        elems.push( child );
    }

    let click = false;
    let valid = false;
    let hits = onClick( 'Camera', elems );
    for ( let hit of hits )
    {
      let parent = hit.actor.getParent().getName();
      Sup.log( parent, hit.actor.getName() );
      if ( parent.length == 1 )
      {
        click = true;
        let name = hit.actor.getName();
        up = ( name == 'ArrowUp' ) ? true : up;
        down = ( name == 'ArrowDown' ) ? true : down;

        let choice = parseInt( parent );
        if ( choice > 0 && choice <= 4 )
        {
          left = ( choice < getColumn() ) ? true : left;
          right = ( choice > getColumn() ) ? true : right;
          setColumn( choice - 1 );
        }
      }
      else if (  hit.actor.getName() == 'Map' )
        valid = true;
    }

    let choice = scene.getChild( ( getColumn() + 1 ).toString() ).getChild( 'Letter' );
    if ( start || up || down || left || right )
    {
      if ( !start && !click && delay < 8 )
        return ;

      delay = 0;
      if ( start || left || right )
      {
        let children = scene.getChildren();
        for ( let child of children )
        {
          if ( child.getName().length == 1 )
            child.getChild( 'Letter' ).textRenderer.setOpacity( .5 );
        }

        choice.textRenderer.setOpacity( 1 );
      }
      if ( up || down )
      {
        let letter = choice.textRenderer.getText()[ 0 ];
        let pos = keys.indexOf( letter );

        if ( up && pos > 0 )
          choice.textRenderer.setText( keys[ pos - 1 ] );
        else if ( down && pos >= 0 && pos < ( keys.length - 1 ) )
          choice.textRenderer.setText( keys[ pos + 1 ] );
      }
    }
    else if ( valid ||  Game.Keys.getEnter( true ) )
    {
      let level = Game.Level.getNumber( Game.Main.Code.get() );
      if ( Game.debug )
        Sup.log( 'Game.code()', 'level: ' + level );

      if ( level )
      {
        Game.started( true );
        Game.Level.set( level );

        Game.behavior( true );
        Game.setMode( 2 );
      }
      else
        Game.setMode( 0 );
    }
    else if ( Game.Keys.getReturn( true ) )
      Game.setMode( 0 );
  }
}