#!/usr/bin/env python3
"""
HEART Website Backup System
Automated backup and rollback for images and configurations
"""

import os
import json
import shutil
import zipfile
from pathlib import Path
from datetime import datetime
import hashlib

class BackupSystem:
    def __init__(self, project_root='.'):
        self.project_root = Path(project_root)
        self.backup_root = self.project_root / 'backups'
        self.images_dir = self.project_root / 'assets' / 'images'
        
        # Create backup directory
        self.backup_root.mkdir(exist_ok=True)
    
    def create_backup(self, backup_name=None):
        """Create complete backup of current state"""
        if not backup_name:
            backup_name = f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        backup_dir = self.backup_root / backup_name
        backup_dir.mkdir(exist_ok=True)
        
        print(f"📦 Creating backup: {backup_name}")
        
        # Backup images
        images_backup = backup_dir / 'images'
        if self.images_dir.exists():
            shutil.copytree(self.images_dir, images_backup)
            print(f"✅ Images backed up to: {images_backup}")
        
        # Backup configuration files
        config_files = [
            'image-version.json',
            '.htaccess',
            'cache-server.py',
            'update-versions.py',
            'js/cache-buster.js'
        ]
        
        config_backup = backup_dir / 'config'
        config_backup.mkdir(exist_ok=True)
        
        for config_file in config_files:
            src_path = self.project_root / config_file
            if src_path.exists():
                if src_path.is_file():
                    shutil.copy2(src_path, config_backup / src_path.name)
                else:
                    shutil.copytree(src_path, config_backup / src_path.name)
        
        # Create backup manifest
        manifest = {
            'backup_name': backup_name,
            'created_at': datetime.now().isoformat(),
            'files_count': len(list(backup_dir.rglob('*'))),
            'size_bytes': sum(f.stat().st_size for f in backup_dir.rglob('*') if f.is_file()),
            'image_versions': self.get_current_versions()
        }
        
        manifest_path = backup_dir / 'manifest.json'
        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)
        
        # Create ZIP archive
        zip_path = self.backup_root / f"{backup_name}.zip"
        self.create_zip_archive(backup_dir, zip_path)
        
        print(f"✅ Backup created: {zip_path}")
        return zip_path
    
    def create_zip_archive(self, source_dir, zip_path):
        """Create ZIP archive of backup"""
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file_path in source_dir.rglob('*'):
                if file_path.is_file():
                    arcname = file_path.relative_to(source_dir)
                    zipf.write(file_path, arcname)
    
    def list_backups(self):
        """List all available backups"""
        backups = []
        
        # Check for ZIP files
        for zip_file in self.backup_root.glob('*.zip'):
            try:
                with zipfile.ZipFile(zip_file, 'r') as zipf:
                    if 'manifest.json' in zipf.namelist():
                        manifest_data = json.loads(zipf.read('manifest.json').decode('utf-8'))
                        backups.append({
                            'name': zip_file.stem,
                            'path': zip_file,
                            'created_at': manifest_data.get('created_at'),
                            'size_mb': zip_file.stat().st_size / (1024 * 1024),
                            'files_count': manifest_data.get('files_count', 0)
                        })
            except Exception as e:
                print(f"⚠️ Error reading backup {zip_file}: {e}")
        
        return sorted(backups, key=lambda x: x['created_at'], reverse=True)
    
    def restore_backup(self, backup_name):
        """Restore from backup"""
        zip_path = self.backup_root / f"{backup_name}.zip"
        
        if not zip_path.exists():
            print(f"❌ Backup not found: {backup_name}")
            return False
        
        print(f"🔄 Restoring backup: {backup_name}")
        
        # Create temporary restore directory
        temp_dir = self.backup_root / 'temp_restore'
        if temp_dir.exists():
            shutil.rmtree(temp_dir)
        
        # Extract backup
        with zipfile.ZipFile(zip_path, 'r') as zipf:
            zipf.extractall(temp_dir)
        
        # Restore images
        backup_images = temp_dir / 'images'
        if backup_images.exists():
            # Backup current images first
            current_backup = self.create_backup(f"pre_restore_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
            
            # Replace current images
            if self.images_dir.exists():
                shutil.rmtree(self.images_dir)
            shutil.copytree(backup_images, self.images_dir)
            print(f"✅ Images restored from backup")
        
        # Restore configuration files
        backup_config = temp_dir / 'config'
        if backup_config.exists():
            for config_file in backup_config.iterdir():
                dest_path = self.project_root / config_file.name
                if config_file.is_file():
                    shutil.copy2(config_file, dest_path)
                else:
                    if dest_path.exists():
                        shutil.rmtree(dest_path)
                    shutil.copytree(config_file, dest_path)
            print(f"✅ Configuration restored from backup")
        
        # Cleanup
        shutil.rmtree(temp_dir)
        
        print(f"✅ Restore completed: {backup_name}")
        return True
    
    def get_current_versions(self):
        """Get current version information"""
        try:
            with open(self.project_root / 'image-version.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
    
    def cleanup_old_backups(self, keep_count=5):
        """Keep only the latest N backups"""
        backups = self.list_backups()
        
        if len(backups) <= keep_count:
            print(f"ℹ️ No cleanup needed. Current backups: {len(backups)}")
            return
        
        to_remove = backups[keep_count:]
        
        for backup in to_remove:
            try:
                backup['path'].unlink()
                print(f"🗑️ Removed old backup: {backup['name']}")
            except Exception as e:
                print(f"❌ Error removing backup {backup['name']}: {e}")
        
        print(f"✅ Cleanup completed. Kept {keep_count} most recent backups")
    
    def print_backup_status(self):
        """Print current backup status"""
        backups = self.list_backups()
        
        print("📋 HEART Website Backup Status")
        print("=" * 40)
        print(f"Total backups: {len(backups)}")
        
        if backups:
            total_size = sum(backup['size_mb'] for backup in backups)
            print(f"Total backup size: {total_size:.1f} MB")
            print(f"Latest backup: {backups[0]['name']}")
            print(f"Created: {backups[0]['created_at']}")
            print()
            
            print("Recent backups:")
            for backup in backups[:5]:
                print(f"  📦 {backup['name']}")
                print(f"      Size: {backup['size_mb']:.1f} MB")
                print(f"      Files: {backup['files_count']}")
                print(f"      Created: {backup['created_at']}")
                print()
        else:
            print("No backups found")

def main():
    """Main backup function"""
    import sys
    
    backup_system = BackupSystem()
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "create":
            backup_name = sys.argv[2] if len(sys.argv) > 2 else None
            backup_system.create_backup(backup_name)
        elif command == "list":
            backup_system.print_backup_status()
        elif command == "restore":
            if len(sys.argv) > 2:
                backup_name = sys.argv[2]
                backup_system.restore_backup(backup_name)
            else:
                print("Usage: python backup-system.py restore <backup_name>")
        elif command == "cleanup":
            keep_count = int(sys.argv[2]) if len(sys.argv) > 2 else 5
            backup_system.cleanup_old_backups(keep_count)
        else:
            print("Usage: python backup-system.py [create|list|restore|cleanup]")
    else:
        # Default: create backup
        backup_system.create_backup()

if __name__ == "__main__":
    main()