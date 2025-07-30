// Global type declarations for external libraries

declare global {
  interface Window {
    gapi: any;
    __firebase_config?: string;
    __initial_auth_token?: string;
  }
  
  var __firebase_config: string | undefined;
  var __initial_auth_token: string | undefined;
}

// Google API types
declare namespace gapi {
  function load(api: string, callback: () => void): void;
  
  namespace client {
    function init(config: any): Promise<void>;
    
    namespace calendar {
      namespace events {
        function insert(params: any): Promise<any>;
        function get(params: any): Promise<any>;
        function update(params: any): Promise<any>;
        function deleteEvent(params: any): Promise<any>;
        function list(params: any): Promise<any>;
      }
    }
  }
  
  namespace auth2 {
    function getAuthInstance(): any;
  }
}

export {}; 