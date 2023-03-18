import AppContext from 'src/contexts';
import { observer } from 'mobx-react-lite';
import { Vector2d } from 'konva/lib/types';
import { KonvaEventObject } from 'konva/lib/Node';
import { useRef, useContext } from 'react';
import { DrawerShape } from 'src/types';
import { Stage, Layer } from 'react-konva';
import Shape from 'src/components/Shape';

const Editor = () => {
  const isDrawing = useRef(false);
  const { shapes, addShape, activeTool, isDrawerTool, updateActiveShape } =
    useContext(AppContext);

  const getPointerPosition = (
    event: KonvaEventObject<MouseEvent>
  ): Vector2d => {
    // Get the current mouse position on the canvas
    const stage = event.target.getStage();
    return stage.getPointerPosition();
  };

  const drawWithMouse = (event: KonvaEventObject<MouseEvent>) => {
    // This method fires when the mouse is pressed down waiting to be released.
    const mousePosition = getPointerPosition(event);
    // The active shape is the last item in the store when mouse
    // was pressed down.
    updateActiveShape(mousePosition);
  };

  const startDrawing = (event: KonvaEventObject<MouseEvent>) => {
    // Get mouse position
    const position = getPointerPosition(event);
    // Check if drawing tool is selected
    if (
      activeTool.tool === DrawerShape.HEXAGON ||
      activeTool.tool === DrawerShape.SQUARE ||
      activeTool.tool === DrawerShape.TRIANGLE
    ) {
      isDrawing.current = true;
      // Add a new shape object to the list of shapes on canvas
      addShape(activeTool.tool, {
        x: position.x,
        y: position.y,
      });
    }
  };

  const onMouseDown = (event: KonvaEventObject<MouseEvent>) => {
    if (isDrawerTool) {
      startDrawing(event);
    }
  };

  const onMouseUp = () => {
    if (isDrawerTool) {
      isDrawing.current = false;
    }
  };

  const onMouseMove = (event: KonvaEventObject<MouseEvent>) => {
    if (isDrawerTool && isDrawing.current) {
      drawWithMouse(event);
    }
  };

  return (
    <div className="editor">
      <Stage
        width={window.innerWidth - 65}
        height={window.innerHeight}
        onMouseDown={onMouseDown}
        onMouseup={onMouseUp}
        onMousemove={onMouseMove}
      >
        <Layer>
          {shapes.map(({ type, id, width, height, x, y, sides }) => (
            <Shape
              x={x}
              y={y}
              id={id}
              key={id}
              type={type}
              width={width}
              sides={sides}
              height={height}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default observer(Editor);