
import React from 'react';
import { Stage, Layer, Line, Text, Image } from 'react-konva';


/** Просто компонент для картинки в канвасе*/
class URLImage extends React.Component {
    state = {
        image: null
    };
    componentDidMount() {
        this.loadImage();
    }
    componentDidUpdate(oldProps) {
        if (oldProps.src !== this.props.src) {
            this.loadImage();
        }
    }
    componentWillUnmount() {
        this.image.removeEventListener('load', this.handleLoad);
    }
    loadImage() {
        // save to "this" to remove "load" handler on unmount
        this.image = new window.Image();
        this.image.src = this.props.src;
        this.image.addEventListener('load', this.handleLoad);
    }
    handleLoad = () => {
        // after setState react-konva will update canvas and redraw the layer
        // because "image" property is changed
        this.setState({
            image: this.image
        });

    };
    render() {
        return (
            <Image
                x={this.props.x}
                y={this.props.y}
                width = {this.props.width}
                height = {this.props.height}
                image={this.state.image}
                ref={node => {
                    this.imageNode = node;
                }}
            />
        );
    }
}




/** Рисование поверх картинки**/
const Canvas = ({height,width,id,src,callbackToParent}) => {
    const [tool, setTool] = React.useState('pen');
    const [lines, setLines] = React.useState([]);
    const isDrawing = React.useRef(false);

    const stageRef = React.useRef(null);

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    };
    const handleExport = async () => {
        const canvasElem = stageRef.current.toCanvas();
        let imageBlob = await new Promise(resolve => canvasElem.toBlob(resolve, 'image/png'));
        callbackToParent(imageBlob);
    };
    const handleMouseMove = (e) => {
        // no drawing - skipping
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        // add point
        lastLine.points = lastLine.points.concat([point.x, point.y]);

        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };
/********************/
    return (
    <div>

        <Stage
            width={width}
            height={height}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            ref={stageRef}
        >
            <Layer>
                <URLImage src={src}
                          width={width}
                          height={height}/>

                {lines.map((line, i) => (
                    <Line
                        key={i}
                        points={line.points}
                        stroke="#df4b26"
                        strokeWidth={5}
                        tension={0.5}
                        lineCap="round"
                        globalCompositeOperation={
                            line.tool === 'eraser' ? 'destination-out' : 'source-over'
                        }
                    />
                ))}
            </Layer>
        </Stage>
        <select
            value={tool}
            onChange={(e) => {
                setTool(e.target.value);
            }}
        >
            <option value="pen">Pen</option>
            <option value="eraser">Eraser</option>
        </select>
        <button onClick={handleExport} className="button">Подтвердить</button>

    </div>
);
};

//render(<App />, document.getElementById('root'));
export default Canvas;