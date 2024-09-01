/*
 * Observes a node for changes in its content and notifies the given callback function
 */
export const observeNode = (
  targetId: string,
  callback: (x: MutationRecord) => void,
) => {
  const targetNode = document.getElementById(targetId)!;
  const config = { attributes: true, childList: true, subtree: true };
  const observer = new MutationObserver((target) => {
    callback(target[0]);
  });
  observer.observe(targetNode, config);
};
