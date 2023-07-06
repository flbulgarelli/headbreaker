import Piece from "./piece";

export type DragMode = { dragShouldDisconnect: (piece: Piece, dx: number, dy: number) => boolean };

export const TryDisconnection: DragMode = {

  dragShouldDisconnect(piece, dx, dy) {
    return piece.horizontalConnector.openMovement(piece, dx) && piece.verticalConnector.openMovement(piece, dy);
  }
}

export const ForceDisconnection: DragMode = {

  dragShouldDisconnect(_piece, _dx, _dy) {
    return true;
  }
}

export const ForceConnection: DragMode = {

  dragShouldDisconnect(_piece, _dx, _dy) {
    return false;
  }
}
