"use client";
import React, { useState } from "react";
import {
  Tree,
  getBackendOptions,
  MultiBackend,
  NodeModel,
  getDescendants,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import { X, ChevronDown, ChevronUp } from "react-feather";


const TreeComponent: React.FC = ({ treeData, setTreeData }) => {
  // const [treeData, setTreeData] = useState<NodeModel[]>(initialData);

  const handleDrop = (newTreeData: NodeModel[]) => {
    console.log("Updated Tree Data:", newTreeData);
    setTreeData(newTreeData);
  };

  const handleDelete = (id: NodeModel["id"]) => {
    const deleteIds = [
      id,
      ...getDescendants(treeData, id).map((node) => node.id),
    ];
    const newTree = treeData.filter((node) => !deleteIds.includes(node.id));

    setTreeData(newTree);
  };

  return (
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <Tree
        tree={treeData}
        rootId={0}
        onDrop={handleDrop}
        sort={false}
        insertDroppableFirst={false}
        dropTargetOffset={10}
        dragPreviewRender={(monitorProps) => (
          <div>{monitorProps.item.text}</div>
        )}
        canDrop={(tree, { dragSource, dropTargetId }) => {
          if (dragSource?.parent === dropTargetId) {
            return true;
          }
        }}
        render={(node, { depth, isOpen, onToggle }) => (
          <div className="relative border rounded p-1 mb-1 flex items-center" style={{ marginLeft: depth * 20, }}>
            {node.droppable && (
              <span onClick={onToggle} style={{ cursor: "pointer", marginRight: 5 }}>
                {isOpen ? <ChevronUp size="14" /> : <ChevronDown size="14" />}
              </span>
            )}
            <div><span>{node.text}</span> <span className="block text-gray-500 text-xs">slug: {node.slug}</span></div>
            <span
              onClick={() => handleDelete(node.id)}
              className="absolute top-2 right-2"
            >
              <X size="14" />
            </span>
          </div>
        )}
        initialOpen={true}
      />
    </DndProvider>
  );
};

export default TreeComponent;