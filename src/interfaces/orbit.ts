import type ImageInterface from "./image";

export default interface OrbitInterface {
    name: string;
    rx: number;
    ry: number;
    rotation: number;
    fill: string;
    duration: number;
    stroke: string;
    strokeWidth: number;
    image: ImageInterface;
}